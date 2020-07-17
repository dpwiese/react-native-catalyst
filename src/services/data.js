export function calcHeartRateFromCharacteristic(byteArray: Uint8Array) {
  // The first bit of the first byte indicates format of heart rate measurement
  const hrValueFormat16bit: boolean = (byteArray[0] & 1) === 1;

  // 8 bit format: take byte [1], 16 bit format: take bytes [1] and [2] and bitshift
  if (hrValueFormat16bit) {
    return (byteArray[1] << 8) | byteArray[2];
  }

  return byteArray[1];
}

// Returns a byte array representing each 8 bits of the base-64 value read left to right
export function base64ToByteArray(base64String: string): Uint8Array {
  // Convert base-64 ascii string to a byte string
  const byteString: string = global.atob(base64String);

  // Create empty uint-8 typed array with length equal to the byte string
  const byteArray: Uint8Array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  return byteArray;
}

export function parseHeartRateFromCharacteristic(byteArray: Uint8Array) {
  const hrValueFormat16bit: boolean = (byteArray[0] & 1) === 1;
  const contactSupported: boolean = (byteArray[0] >> 1 & 1) === 1;
  const contactDetected: boolean = (byteArray[0] >> 2 & 1) === 1;
  const energyExpendedPresent: boolean = (byteArray[0] >> 3 & 1) === 1;
  const rrValuesPresent: boolean = (byteArray[0] >> 4 & 1) === 1;

  console.log("---------------------------------------------------");
  console.log("Full characteristic value:                   " + byteArray);
  console.log("flag[0] Heart Rate Value Format 16 bit:      " + hrValueFormat16bit);
  console.log("flag[1] Sensor Contact feature is supported: " + contactSupported);
  console.log("flag[2] Skin contact detected:               " + contactDetected);
  console.log("flag[3] Energy Expended field present:       " + energyExpendedPresent);
  console.log("flag[4] RR-Interval values present:          " + rrValuesPresent);
}

export function calcEnergyExpendedFromCharacteristic(byteArray: Uint8Array) {
  // The first bit of the first byte indicates format of heart rate measurement
  const hrValueFormat16bit: boolean = (byteArray[0] & 1) === 1;

  // The first bit of the first byte indicates presence of energy expended field
  const energyExpendedPresent: boolean = (byteArray[0] >> 3 & 1) === 1;

  if (energyExpendedPresent) {
    if (hrValueFormat16bit) {
      return (byteArray[3] << 8) | byteArray[4];
    }
    return (byteArray[2] << 8) | byteArray[3];
  }
}

export function calcRestRecoveryIntervalsFromCharacteristic(byteArray: Uint8Array) {
  // The first bit of the first byte indicates format of heart rate measurement
  const hrValueFormat16bit: boolean = (byteArray[0] & 1) === 1;

  // The fourth bit of the first byte indicates presence of energy expended field
  const energyExpendedPresent: boolean = (byteArray[0] >> 3 & 1) === 1;

  // The fifth bit of the first byte indicates presence of RR intervals
  const rrValuesPresent: boolean = (byteArray[0] >> 4 & 1) === 1;

  const lengthHrValues: number = hrValueFormat16bit ? 2 : 1;
  const lengthEnergyExpendedValues: number = energyExpendedPresent ? 2 : 0;
  const offsetRrValues: number = 1 + lengthHrValues + lengthEnergyExpendedValues;

  if (rrValuesPresent) {
    return (byteArray[offsetRrValues] << 8) | byteArray[offsetRrValues + 1];
  }
}

export function byteArrayToHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
