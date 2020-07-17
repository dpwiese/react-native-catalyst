/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Button from './src/components/Button';
import { BleUuid, CUSTOM_DEVICE_NAME } from './src/constants/bluetooth';
import {
  base64ToByteArray,
  calcEnergyExpendedFromCharacteristic,
  calcHeartRateFromCharacteristic,
  calcRestRecoveryIntervalsFromCharacteristic,
  parseHeartRateFromCharacteristic,
  byteArrayToHexString,
} from './src/services/data';

import {decode as atob, encode as btoa} from 'base-64'

const base64 = require('base-64');

if (!global.atob) {
  global.atob = base64.decode;
}

const Computation = NativeModules.Computation;

class App extends Component {

  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {
      hrmDevice: null,
      device: null,
      services: null,
      monitorResponse: null,
    };
  }

  nativeCallback = (out) => {
    console.log(out);
  };

  runNativeComuptation = () => {
    Computation.concatenateStrings('hello', 'world', this.nativeCallback);
  };

  componentDidMount = () => {
    console.log("Component mounted");
    const subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        subscription.remove();
      }
    }, true);
  }

  scanAndConnectToHrm = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning for HRM");
      if (error) {
        console.log(error);
        return
      }

      // Find a HRM and connect
      if (device.serviceUUIDs && device.serviceUUIDs.includes(BleUuid.HEART_RATE_SERVICE)) {
        this.manager.stopDeviceScan();
        device.connect()
          .then((device) => {
            console.log("Connected to HRM");
            this.state.hrmDevice = device;
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            return this.manager.characteristicsForDevice(device.id, BleUuid.HEART_RATE_SERVICE);
          })
          .then((characteristics) => {
            if (characteristics && characteristics[0].uuid.includes(BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC)) {
              console.log("Monitoring " + device.name);
              console.log(BleUuid.HEART_RATE_SERVICE);
              console.log(BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC);
              device.monitorCharacteristicForService(
                BleUuid.HEART_RATE_SERVICE,
                BleUuid.HEART_RATE_MEASUREMENT_CHARACTERISTIC,
                (error, characteristic) => {
                  if (error) {
                    console.log(error);
                    return;
                  }
                  if (characteristic && characteristic.value) {
                    const byteArray = base64ToByteArray(characteristic.value);
                    const heartRate = calcHeartRateFromCharacteristic(byteArray);
                    const energyExpended = calcEnergyExpendedFromCharacteristic(byteArray);
                    const restRecovery = calcRestRecoveryIntervalsFromCharacteristic(byteArray);
                    console.log(heartRate);
                  }
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  stopScanningAndDisconnectFromHrm = () => {
    console.log("Stopping scanning and disconnecting from HRM");
    this.manager.stopDeviceScan();
    device = this.state.hrmDevice;
    if (device) {
      device.cancelDeviceConnection();
      this.state.hrmDevice = null;
    }
  }

  scanAndConnect = () => {
    console.log("Scanning and connecting");
    this.manager.startDeviceScan(null, null, (error, device) => {
      console.log(device.localName);
      if (error) {
        console.log(error);
        return
      }

      if (device && device.localName == CUSTOM_DEVICE_NAME) {
        this.manager.stopDeviceScan();
        device.connect()
          .then((device) => {
            this.state.device = device;
            console.log("Connected");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
  }

  discoverServices = () => {
    console.log("Discovering and reading");
    device = this.state.device;
    if (device) {
      device.discoverAllServicesAndCharacteristics()
        .then((device) => {
          return device.services();
        })
        .then((services) => {
          this.state.services = services;
          console.log("found services");
          services.forEach(service => console.log(service.uuid));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  monitorCharacteristic = () => {
    console.log("Monitoring characteristic");
    device = this.state.device;
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
        });
    }
  }

  sendCommand = () => {
    device = this.state.device;
    if (device) {
      console.log("Sending command")
      const arr = new Uint8Array([1, 2, 3]);
      val = btoa(String.fromCharCode.apply(null, arr));
      device.writeCharacteristicWithoutResponseForService(BleUuid.CUSTOM_SERVICE, BleUuid.CUSTOM_REQUEST_CHARACTERISTIC, val);
    }
  }

  stopScanning = () => {
    console.log("Stopping scanning");
    this.manager.stopDeviceScan();
  }

  disconnect = () => {
    console.log("Disconnecting");
    device = this.state.device;
    if (device && device.isConnected()) {
      device.cancelConnection();
      this.state.device = null;
    }
  }

    }
  }

  render() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Run Native Computation</Text>
              <Button onPress={this.runNativeComuptation} text={"Run Native Computation"}/>
              <Text style={styles.sectionTitle}>Heart Rate</Text>
              <Button onPress={this.scanAndConnectToHrm} text={"Scan and Connect"}/>
              <Button onPress={this.stopScanningAndDisconnectFromHrm} text={"Stop Scanning and Disconnect"}/>
              <Text style={styles.sectionTitle}>Custom Device</Text>
              <Button onPress={this.scanAndConnect} text={"Scan and Connect"}/>
              <Button onPress={this.discoverServices} text={"Discover Services"}/>
              <Button onPress={this.monitorCharacteristic} text={"Monitor Characteristic"}/>
              <Button onPress={this.sendCommand} text={"Send Command"}/>
              <Button onPress={this.disconnect} text={"Disconnect"}/>
              <Button onPress={this.stopScanning} text={"STOP SCANNING"}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )};
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
});

export default App;
