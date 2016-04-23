#include <stdint.h>

struct mgmt_header_t {
    uint16_t   fc;
    uint16_t   duration;
    uint8_t    da[6];
    uint8_t    sa[6];
    uint8_t    bssid[6];
    uint16_t   seq_ctrl;
};
