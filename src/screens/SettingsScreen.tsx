import { BleManager, Device, Subscription } from "react-native-ble-plx";
import { BleUuid, CUSTOM_DEVICE_NAME } from "../constants/bluetooth";
import { NativeModules, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import {
  base64ToByteArray,
  byteArrayToHexString,
  calcEnergyExpendedFromCharacteristic,
  calcHeartRateFromCharacteristic,
  calcRestRecoveryIntervalsFromCharacteristic,
} from "../services/data";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import { encode as btoa } from "base-64";

const Computation = NativeModules.Computation;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  body: {
    backgroundColor: "white",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
  },
});

const bleManager = new BleManager();

export default (): ReactElement => {
  const [device, setDevice] = useState<Device | null>();
  const [hrmDevice, setHrmDevice] = useState<Device | null>();
  // const [services, setServices] = useState<Service[] | null>([]);
  const [monitorResponse, setMonitorResponse] = useState<Subscription | null>();

  const nativeCallback = (out: string): void => {
    console.log(out);
  };

  const runNativeComuptation = (): void => {
    Computation.concatenateStrings("hello", "world", nativeCallback);
  };

  useEffect(() => {
    console.log("Component mounted");
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        subscription.remove();
      }
    }, true);
  }, []);

  const scanAndConnectToHrm = (): void => {
    bleManager.startDeviceScan(null, null, (error, dev) => {
      console.log("Scanning for HRM");
      if (error) {
        console.log(error);
        return;
      }

      if (!dev) {
        console.log("Scanned device is null");
        return;
      }

      // Find a HRM and connect
      if (dev.serviceUUIDs && dev.serviceUUIDs.includes(BleUuid.HEART_RATE_SERVICE)) {
        bleManager.stopDeviceScan();
        dev
          .connect()
          .then((connectedDevice) => {
            console.log("Connected to HRM");
            setHrmDevice(connectedDevice);
            return dev.discoverAllServicesAndCharacteristics();
          })
          .then((connectedDevice) => {
            return bleManager.characteristicsForDevice(connectedDevice.id, BleUuid.HEART_RATE_SERVICE);
          })
          .then((characteristics) => {
            if (characteristics && characteristics[0].uuid.includes(BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC)) {
              console.log("Monitoring " + dev.name);
              console.log(BleUuid.HEART_RATE_SERVICE);
              console.log(BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC);
              dev.monitorCharacteristicForService(
                BleUuid.HEART_RATE_SERVICE,
                BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC,
                (err, characteristic) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  if (characteristic && characteristic.value) {
                    const byteArray = base64ToByteArray(characteristic.value);
                    const heartRate = calcHeartRateFromCharacteristic(byteArray);
                    const _energyExpended = calcEnergyExpendedFromCharacteristic(byteArray);
                    const _restRecovery = calcRestRecoveryIntervalsFromCharacteristic(byteArray);
                    console.log(heartRate);
                  }
                }
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const stopScanningAndDisconnectFromHrm = (): void => {
    console.log("Stopping scanning and disconnecting from HRM");
    bleManager.stopDeviceScan();
    if (hrmDevice) {
      hrmDevice.cancelConnection();
      setHrmDevice(null);
    }
  };

  const scanAndConnect = (): void => {
    console.log("Scanning and connecting");
    bleManager.startDeviceScan(null, null, (error, dev) => {
      if (error) {
        console.log(error);
        return;
      }

      if (dev && dev.localName === CUSTOM_DEVICE_NAME) {
        bleManager.stopDeviceScan();
        dev
          .connect()
          .then((connectedDevice) => {
            setDevice(connectedDevice);
            console.log("Connected");
            // console.log(device.mtu);
            // return device.discoverAllServicesAndCharacteristics();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const discoverServices = (): void => {
    console.log("Discovering and reading");
    if (device) {
      device
        .discoverAllServicesAndCharacteristics()
        .then((connectedDevice) => {
          return connectedDevice.services();
        })
        .then((services) => {
          // setServices(services);
          console.log("found services");
          services.forEach((service) => console.log(service.uuid));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const readBondManagementCharacteristic = (): void => {
    if (device) {
      device
        .readCharacteristicForService(BleUuid.BOND_MANAGEMENT_SERVICE, BleUuid.BOND_MANAGEMENT_FEATURE_CHARACTERISTIC)
        .then((characteristic) => {
          console.log(characteristic.value);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const readHrCharacteristic = (): void => {
    if (device) {
      device
        .readCharacteristicForService(
          BleUuid.HEART_RATE_DEVICE_INFORMATION_SERVICE,
          BleUuid.HEART_RATE_MANUFACTURER_NAME_CHARACTERISTIC
        )
        .then((characteristic) => {
          console.log(characteristic.value);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const monitorCharacteristic = (): void => {
    console.log("Monitoring characteristic");
    if (device) {
      const res = device.monitorCharacteristicForService(
        BleUuid.CUSTOM_SERVICE,
        BleUuid.CUSTOM_RESPONSE_CHARACTERISTIC,
        (error, characteristic) => {
          if (error) {
            console.log(error);
            return;
          }
          if (characteristic && characteristic.value) {
            console.log("Receiving response");
            console.log(characteristic.value);
            console.log(byteArrayToHexString(base64ToByteArray(characteristic.value)));
          }
        }
      );
      setMonitorResponse(res);
    }
  };

  const sendCommand = (): void => {
    if (device) {
      console.log("Sending command");
      const arr = new Uint8Array([1, 2, 3]);
      const val = btoa(String.fromCharCode.apply(null, Array.from(arr)));
      device.writeCharacteristicWithoutResponseForService(
        BleUuid.CUSTOM_SERVICE,
        BleUuid.CUSTOM_REQUEST_CHARACTERISTIC,
        val
      );
    }
  };

  const stopScanning = (): void => {
    console.log("Stopping scanning");
    bleManager.stopDeviceScan();
  };

  const disconnect = (): void => {
    console.log("Disconnecting");
    if (device && device.isConnected()) {
      device.cancelConnection();
      setDevice(null);
    }
  };

  const clearAllBondsAndDisconnect = (): void => {
    if (device) {
      const arr = new Uint8Array([0x06]);
      const val = btoa(String.fromCharCode.apply(null, Array.from(arr)));
      device.writeCharacteristicWithoutResponseForService(
        BleUuid.BOND_MANAGEMENT_SERVICE,
        BleUuid.BOND_MANAGEMENT_CONTROL_POINT_CHARACTERISTIC,
        val
      );
      if (monitorResponse) {
        monitorResponse.remove();
      }
      device.cancelConnection();
      setDevice(null);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Run Native Computation</Text>
            <Button onPress={runNativeComuptation} text={"Run Native Computation"} />
            <Text style={styles.sectionTitle}>Heart Rate</Text>
            <Button onPress={scanAndConnectToHrm} text={"Scan and Connect"} />
            <Button onPress={stopScanningAndDisconnectFromHrm} text={"Stop Scanning and Disconnect"} />
            <Text style={styles.sectionTitle}>Custom Device</Text>
            <Button onPress={scanAndConnect} text={"Scan and Connect"} />
            <Button onPress={discoverServices} text={"Discover Services"} />
            <Button onPress={monitorCharacteristic} text={"Monitor Characteristic"} />
            <Button onPress={sendCommand} text={"Send Command"} />
            <Button onPress={disconnect} text={"Disconnect"} />
            <Button onPress={stopScanning} text={"Stop Scanning"} />
            <Text style={styles.sectionTitle}>More Stuff</Text>
            <Button onPress={readBondManagementCharacteristic} text={"READ BOND MANAGEMENT CHARACTERISTIC"} />
            <Button onPress={readHrCharacteristic} text={"READ HR CHARACTERISTIC"} />
            <Button onPress={clearAllBondsAndDisconnect} text={"CLEAR ALL BONDS AND DISCONNECT"} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
