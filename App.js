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
import { BleUuid } from './src/constants/bluetooth';
import {
  base64ToByteArray,
  calcEnergyExpendedFromCharacteristic,
  calcHeartRateFromCharacteristic,
  calcRestRecoveryIntervalsFromCharacteristic,
  parseHeartRateFromCharacteristic
} from './src/services/data';

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
      device: null,
    };
  }

  nativeCallback = (out) => {
    console.log(out);
  };

  runNativeComuptation = () => {
    Computation.concatenateStrings('hello', 'world', this.nativeCallback);
  };

  componentDidMount = () => {
    console.log("MOUNTED");
    const subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        subscription.remove();
      }
    }, true);
  }

  scanAndConnect = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      console.log("SCANNING!");
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }

      // Find a HRM and connect
      if (device.serviceUUIDs && device.serviceUUIDs.includes(BleUuid.HEART_RATE_SERVICE)) {
        this.manager.stopDeviceScan();
        device.connect()
          .then((device) => {
            this.state.device = device;
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
                    console.log("error!");
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
            // Handle errors
          });
      }
    });
  }

  stopScanning = () => {
    console.log("STOPPING SCANNING AND DISCONNECTING!");
    this.manager.stopDeviceScan();
    if (this.state.device) {
      this.manager.cancelDeviceConnection(this.state.device.id);
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
              <Text style={styles.sectionTitle}>React Native Catalyst</Text>
              <Button onPress={this.runNativeComuptation} text={"NATIVE"}/>
              <Button onPress={this.scanAndConnect} text={"SCAN AND CONNECT"}/>
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
