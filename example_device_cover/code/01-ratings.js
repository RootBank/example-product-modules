// 01-ratings.js
// add all rating tables, csv and calculation functions here

const deviceTypeLoadings = {
  cellphone: 1.5,
  tablet: 1.3,
  laptop: 1.4,
  smartwatch: 1.2,
  digital_camera: 1.3,
  e_reader: 1.1,
  portable_gaming_console: 1.2,
  drone: 1.6,
  fitness_tracker: 1.1,
  bluetooth_earbuds: 1.2,
  portable_speaker: 1.2,
  vr_headset: 1.3,
  smart_glasses: 1.5,
  external_hard_drive: 1.1,
  portable_media_player: 1.2,
};

const excessLoadings = {
  "£300": 1.0,
  "£200": 1.1,
  "£100": 1.3,
  "£50": 1.5,
};

const coverPackageLoadings = {
  theft: 1.0,
  comprehensive: 1.9,
};

const claimsHistoryLoadings = {
  0: 1.0,
  1: 1.1,
  2: 1.3,
  3: 1.5,
  "4+": 1.8,
};

const loanerDeviceLoading = 1.1;
