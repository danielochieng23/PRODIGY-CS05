from scapy.all import sniff, IP, TCP, UDP, ARP, ICMP, Raw, conf
from datetime import datetime

def packet_callback(packet):
    packet_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    src_ip = dst_ip = src_port = dst_port = protocol_name = payload_data = "N/A"
    
    if IP in packet:
        ip_layer = packet[IP]
        src_ip = ip_layer.src
        dst_ip = ip_layer.dst
        protocol = ip_layer.proto
        
        if protocol == 6:  # TCP
            protocol_name = "TCP"
            tcp_layer = packet[TCP]
            src_port = tcp_layer.sport
            dst_port = tcp_layer.dport
            if Raw in packet:
                payload_data = packet[Raw].load
        elif protocol == 17:  # UDP
            protocol_name = "UDP"
            udp_layer = packet[UDP]
            src_port = udp_layer.sport
            dst_port = udp_layer.dport
            if Raw in packet:
                payload_data = packet[Raw].load
        elif protocol == 1:  # ICMP
            protocol_name = "ICMP"
    elif ARP in packet:
        protocol_name = "ARP"
        src_ip = packet[ARP].psrc
        dst_ip = packet[ARP].pdst

    print(f"Time: {packet_time}")
    print(f"Source IP: {src_ip}")
    print(f"Destination IP: {dst_ip}")
    print(f"Protocol: {protocol_name}")
    print(f"Source Port: {src_port}")
    print(f"Destination Port: {dst_port}")
    if payload_data != "N/A":
        print(f"Payload: {payload_data}")
    print("\n" + "-"*80 + "\n")

def start_sniffing():
    conf.L3socket = conf.L3socket  # Use Layer 3 socket
    print("Starting packet sniffing...")
    sniff(prn=packet_callback, store=0)

if __name__ == "__main__":
    start_sniffing()
