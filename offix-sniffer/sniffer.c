#include "radiotap.h"
#include "80211.h"

#include <amqp.h>
#include <amqp_tcp_socket.h>
#include <pcap.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

#define DEVICE ("wlan0")
#define QUEUE_HOSTNAME ("localhost")
#define QUEUE_PORT (5672)
#define QUEUE_EXCHANGE_NAME ("offix")

void parse_packet(u_char *args, const struct pcap_pkthdr *header, const u_char *packet);
void die(const char *context);
void die_on_amqp_error(amqp_rpc_reply_t reply, const char *context);
void die_if_null(const void *ptr, const char *context);

amqp_connection_state_t queue_connect();
void send_message(amqp_connection_state_t conn, const char *body);

int main()
{
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *handle;
    char filter_exp[] = "type mgt subtype probe-req";
    struct bpf_program fp;
    amqp_connection_state_t conn;

    conn = queue_connect();

    handle = pcap_open_live(DEVICE, BUFSIZ, 1, 1000, errbuf);
    if (handle == NULL)
    {
        die("Couldn't open device");
    }
    if (pcap_datalink(handle) != DLT_IEEE802_11_RADIO) {
        // see http://www.tcpdump.org/linktypes.html
        die("Device doesn't provide Radiotap link-layer information");
    }

    if (pcap_compile(handle, &fp, filter_exp, 0, PCAP_NETMASK_UNKNOWN) == -1)
    {
        die("Couldn't parse filter");
    }

    if (pcap_setfilter(handle, &fp) == -1)
    {
        die("Couldn't install filter");
    }

    pcap_loop(handle, -1, parse_packet, (u_char *) conn);

    pcap_freecode(&fp);
    pcap_close(handle);
    amqp_connection_close(conn, AMQP_REPLY_SUCCESS);

    return 0;
}

void parse_packet(u_char *args, const struct pcap_pkthdr *header, const u_char *packet)
{
    amqp_connection_state_t conn;
    struct ieee80211_radiotap_header *radiotap;
    struct mgmt_header_t *frame;
    char buf[6*2 + (6 - 1) + 1];

    conn = (amqp_connection_state_t) args;

    (void) args; // unused arg

    if (header->caplen < sizeof(struct ieee80211_radiotap_header))
    {
        return;
    }
    radiotap = (struct ieee80211_radiotap_header *) packet;

    if (header->caplen < radiotap->it_len + sizeof(struct mgmt_header_t))
    {
        return;
    }
    frame = (struct mgmt_header_t *) (packet + radiotap->it_len);
    snprintf(buf, sizeof(buf), "%02x:%02x:%02x:%02x:%02x:%02x",
        frame->sa[0],
        frame->sa[1],
        frame->sa[2],
        frame->sa[3],
        frame->sa[4],
        frame->sa[5]);
    // publish
    send_message(conn, buf);
    printf("%s\n", buf); // also print to help with debugging
}

void send_message(amqp_connection_state_t conn, const char *body)
{
    int status;

    amqp_basic_properties_t props;
    props._flags = AMQP_BASIC_CONTENT_TYPE_FLAG | AMQP_BASIC_DELIVERY_MODE_FLAG;
    props.content_type = amqp_cstring_bytes("text/plain");
    props.delivery_mode = 2; // persistent delivery mode
    status = amqp_basic_publish(conn, 1, amqp_cstring_bytes(QUEUE_EXCHANGE_NAME),
        amqp_cstring_bytes(""), 0, 0, &props, amqp_cstring_bytes(body));
    if (status != AMQP_STATUS_OK)
    {
        die("Error publishing message");
    }
}

amqp_connection_state_t queue_connect()
{
    amqp_socket_t *socket;
    amqp_connection_state_t conn;
    int status;

    conn = amqp_new_connection();
    socket = amqp_tcp_socket_new(conn);
    die_if_null(socket, "Error creating TCP socket");
    status = amqp_socket_open(socket, QUEUE_HOSTNAME, QUEUE_PORT);
    if (status != AMQP_STATUS_OK)
    {
        die("Error opening TCP socket");
    }
    die_on_amqp_error(amqp_login(conn, "/", 0, 131072, 0,
        AMQP_SASL_METHOD_PLAIN, "guest", "guest"), "logging in");
    amqp_channel_open(conn, 1);
    die_on_amqp_error(amqp_get_rpc_reply(conn), "opening channel");

    return conn;
}

void die_on_amqp_error(amqp_rpc_reply_t reply, const char *context)
{
    if (reply.reply_type != AMQP_RESPONSE_NORMAL)
    {
        fprintf(stderr, "AMQP error: %s\n", context);
        exit(1);
    }
}

void die_if_null(const void *ptr, const char *context)
{
    if (ptr == NULL)
    {
        fprintf(stderr, "Unexpected null pointer: %s\n", context);
        exit(1);
    }
}

void die(const char *context)
{
    fprintf(stderr, "%s\n", context);
    exit(1);
}
