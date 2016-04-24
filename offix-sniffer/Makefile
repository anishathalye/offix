CC := gcc
CCFLAGS := -std=gnu99 -O3 -Wall -Wextra -Werror -pedantic
LDFLAGS := -lpcap -lrabbitmq

HEADERFILES := \
	radiotap.h \
	ieee80211.h \


.PHONY: all
all: sniffer

%.o: %.c $(HEADERFILES)
	$(CC) $(CCFLAGS) -c $< -o $@

sniffer: sniffer.o
	$(CC) -o $@ $^ $(LDFLAGS)

.PHONY: clean
clean:
	rm -rf *.o sniffer
