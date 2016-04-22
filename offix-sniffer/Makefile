CC := gcc
CCFLAGS := -O3 -Wall -Wextra -Werror -pedantic
LDFLAGS := -lpcap

HEADERFILES := \


all: sniffer

%.o: %.c $(HEADERFILES)
	$(CC) $(CCFLAGS) -c $< -o $@

sniffer: sniffer.o
	$(CC) -o $@ $^ $(LDFLAGS)

.PHONY: clean
clean:
	rm -rf *.o sniffer
