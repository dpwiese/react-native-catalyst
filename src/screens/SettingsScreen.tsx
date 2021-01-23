import { BleManager, Device, Service, Subscription } from "react-native-ble-plx";
import { BleUuid, CUSTOM_DEVICE_NAME } from "../constants/bluetooth";
import { NativeModules, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { Component } from "react";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";

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

class SettingsScreen extends Component {
  manager: BleManager;
  state: {
    hrmDevice: Device | null;
    device: Device | null;
    services: Service[] | null;
    monitorResponse: Subscription | null;
  };

  constructor(props: {}) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      hrmDevice: null,
      device: null,
      services: null,
      monitorResponse: null,
    };
  }

  nativeCallback = (out: string): void => {
    console.log(out);
  };

  runNativeComuptation = (): void => {
    Computation.concatenateStrings("hello", "world", this.nativeCallback);
  };

  componentDidMount = (): void => {
    console.log("Component mounted");
    const subscription = this.manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        subscription.remove();
      }
    }, true);
  };

  scanAndConnectToHrm = (): void => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning for HRM");
      if (error) {
        console.log(error);
        return;
      }

      if (!device) {
        console.log("Scanned device is null");
        return;
      }

      // Find a HRM and connect
      if (device.serviceUUIDs && device.serviceUUIDs.includes(BleUuid.HEART_RATE_SERVICE)) {
        this.manager.stopDeviceScan();
        device
          .connect()
          .then((connectedDevice) => {
            console.log("Connected to HRM");
            this.state.hrmDevice = connectedDevice;
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((connectedDevice) => {
            return this.manager.characteristicsForDevice(connectedDevice.id, BleUuid.HEART_RATE_SERVICE);
          })
          .then((characteristics) => {
            if (characteristics && characteristics[0].uuid.includes(BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC)) {
              console.log("Monitoring " + device.name);
              console.log(BleUuid.HEART_RATE_SERVICE);
              console.log(BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC);
              device.monitorCharacteristicForService(
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

  stopScanningAndDisconnectFromHrm = (): void => {
    console.log("Stopping scanning and disconnecting from HRM");
    this.manager.stopDeviceScan();
    const device = this.state.hrmDevice;
    if (device) {
      device.cancelConnection();
      this.state.hrmDevice = null;
    }
  };

  scanAndConnect = (): void => {
    console.log("Scanning and connecting");
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device && device.localName === CUSTOM_DEVICE_NAME) {
        this.manager.stopDeviceScan();
        device
          .connect()
          .then((connectedDevice) => {
            this.state.device = connectedDevice;
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

  discoverServices = (): void => {
    console.log("Discovering and reading");
    const device = this.state.device;
    if (device) {
      device
        .discoverAllServicesAndCharacteristics()
        .then((connectedDevice) => {
          return connectedDevice.services();
        })
        .then((services) => {
          this.state.services = services;
          console.log("found services");
          services.forEach((service) => console.log(service.uuid));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  readBondManagementCharacteristic = (): void => {
    const device = this.state.device;
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

  readHrCharacteristic = (): void => {
    const device = this.state.device;
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

  monitorCharacteristic = (): void => {
    console.log("Monitoring characteristic");
    const device = this.state.device;
    if (device) {
      this.state.monitorResponse = device.monitorCharacteristicForService(
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
    }
  };

  sendCommand = (): void => {
    const device = this.state.device;
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

  stopScanning = (): void => {
    console.log("Stopping scanning");
    this.manager.stopDeviceScan();
  };

  disconnect = (): void => {
    console.log("Disconnecting");
    const device = this.state.device;
    if (device && device.isConnected()) {
      device.cancelConnection();
      this.state.device = null;
    }
  };

  clearAllBondsAndDisconnect = (): void => {
    const device = this.state.device;
    if (device) {
      const arr = new Uint8Array([0x06]);
      const val = btoa(String.fromCharCode.apply(null, Array.from(arr)));
      device.writeCharacteristicWithoutResponseForService(
        BleUuid.BOND_MANAGEMENT_SERVICE,
        BleUuid.BOND_MANAGEMENT_CONTROL_POINT_CHARACTERISTIC,
        val
      );
      if (this.state.monitorResponse) {
        this.state.monitorResponse.remove();
      }
      device.cancelConnection();
      this.state.device = null;
    }
  };

  render(): ReactNode {
    return (
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Run Native Computation</Text>
              <Button onPress={this.runNativeComuptation} text={"Run Native Computation"} />
              <Text style={styles.sectionTitle}>Heart Rate</Text>
              <Button onPress={this.scanAndConnectToHrm} text={"Scan and Connect"} />
              <Button onPress={this.stopScanningAndDisconnectFromHrm} text={"Stop Scanning and Disconnect"} />
              <Text style={styles.sectionTitle}>Custom Device</Text>
              <Button onPress={this.scanAndConnect} text={"Scan and Connect"} />
              <Button onPress={this.discoverServices} text={"Discover Services"} />
              <Button onPress={this.monitorCharacteristic} text={"Monitor Characteristic"} />
              <Button onPress={this.sendCommand} text={"Send Command"} />
              <Button onPress={this.disconnect} text={"Disconnect"} />
              <Button onPress={this.stopScanning} text={"Stop Scanning"} />
              <Text style={styles.sectionTitle}>More Stuff</Text>
              <Button onPress={this.readBondManagementCharacteristic} text={"READ BOND MANAGEMENT CHARACTERISTIC"} />
              <Button onPress={this.readHrCharacteristic} text={"READ HR CHARACTERISTIC"} />
              <Button onPress={this.clearAllBondsAndDisconnect} text={"CLEAR ALL BONDS AND DISCONNECT"} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default SettingsScreen;
