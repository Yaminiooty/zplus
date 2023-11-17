echo 'nameserver 8.8.8.8' >> /etc/resolv.conf

keytool -importcert -file /z_scalar.crt -keystore /usr/lib/jvm/java-11-openjdk-amd64/lib/security/cacerts -alias "nvd-dependency-check" -storepass changeit -noprompt

ln -s /usr/bin/python3 /usr/bin/python

sqlmapapi.py -s -H $(hostname -i) &

/usr/sbin/sshd -D