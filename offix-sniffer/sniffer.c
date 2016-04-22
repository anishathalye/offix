#include <amqp.h>
#include <amqp_tcp_socket.h>
#include <pcap.h>

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

#define QUEUE_HOSTNAME ("localhost")
#define QUEUE_PORT (5672)
#define QUEUE_EXCHANGE_NAME ("offix")

void die(const char *context);
void die_on_amqp_error(amqp_rpc_reply_t reply, const char *context);
void die_if_null(const void *ptr, const char *context);

amqp_connection_state_t queue_connect();
void send_message(amqp_connection_state_t conn, const char *body);

int main()
{
    amqp_connection_state_t conn;

    conn = queue_connect();
    // a test message
    send_message(conn, "00:11:22:33:44:55");

    return 0;
}

void send_message(amqp_connection_state_t conn, const char *body)
{
    int status;

    amqp_basic_properties_t props;
    props._flags = AMQP_BASIC_CONTENT_TYPE_FLAG | AMQP_BASIC_DELIVERY_MODE_FLAG;
    props.content_type = amqp_cstring_bytes("text/plain");
    props.delivery_mode = 2; /* persistent delivery mode */
    status = amqp_basic_publish(conn,
        1,
        amqp_cstring_bytes(QUEUE_EXCHANGE_NAME),
        amqp_cstring_bytes(""),
        0,
        0,
        &props,
        amqp_cstring_bytes(body));
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
