export interface DriverInfo {
  name: string
  phone: string
  plateNumber: string
  vehicleType: string
  compartmentTemp: number // e.g. 3.2°C
  tempSafeRange: string // '2–8°C'
  lastTelemetryTime: string
}

export interface ShipmentTimelineEvent {
  step: number
  title: string
  description: string
  time: string
  isCompleted: boolean
  isCurrent: boolean
}

export interface ReeferTrip {
  id: string
  tripCode: string
  driverName: string
  driverPhone: string
  plateNumber: string
  ordersCount: number
  area: string
  currentTemp: number
  minTemp: number
  maxTemp: number
  status: 'departed' | 'delivering' | 'completed' | 'incident'
  departureTime: string
}

export interface TempLogEntry {
  id: string
  time: string
  tripCode: string
  sensorId: string
  temperature: number
  humidity: number
  status: 'normal' | 'warning' | 'critical'
  note?: string
}

export const MOCK_REEFER_TRIPS: ReeferTrip[] = [
  {
    id: 'trip-01',
    tripCode: 'CH-2610-01',
    driverName: 'Nguyễn Văn Hùng',
    driverPhone: '0914 888 292',
    plateNumber: '29C-881.92',
    ordersCount: 5,
    area: 'Đống Đa - Ba Đình - Cầu Giấy (Hà Nội)',
    currentTemp: 3.2,
    minTemp: 2.4,
    maxTemp: 4.8,
    status: 'delivering',
    departureTime: '13:30, 08/10/2026',
  },
  {
    id: 'trip-02',
    tripCode: 'CH-2610-02',
    driverName: 'Trịnh Đình Quang',
    driverPhone: '0908 123 789',
    plateNumber: '29H-452.18',
    ordersCount: 4,
    area: 'Hoàn Kiếm - Hai Bà Trưng - Hoàng Mai (Hà Nội)',
    currentTemp: 4.1,
    minTemp: 3.0,
    maxTemp: 5.6,
    status: 'delivering',
    departureTime: '14:00, 08/10/2026',
  },
  {
    id: 'trip-03',
    tripCode: 'CH-2610-03',
    driverName: 'Lê Minh Tuấn',
    driverPhone: '0937 654 321',
    plateNumber: '51D-902.34',
    ordersCount: 7,
    area: 'Quận 1 - Quận 3 - Bình Thạnh (TP.HCM)',
    currentTemp: 3.8,
    minTemp: 2.8,
    maxTemp: 4.5,
    status: 'delivering',
    departureTime: '11:15, 08/10/2026',
  },
  {
    id: 'trip-04',
    tripCode: 'CH-2610-04',
    driverName: 'Hoàng Văn Bách',
    driverPhone: '0912 777 999',
    plateNumber: '29C-774.20',
    ordersCount: 3,
    area: 'Long Biên - Gia Lâm (Hà Nội)',
    currentTemp: 8.6, // EXCEEDS 8°C FOR DEMO WARNING
    minTemp: 3.5,
    maxTemp: 8.6,
    status: 'incident',
    departureTime: '12:00, 08/10/2026',
  },
  {
    id: 'trip-05',
    tripCode: 'CH-2610-05',
    driverName: 'Phạm Thành Long',
    driverPhone: '0973 112 334',
    plateNumber: '51C-661.85',
    ordersCount: 6,
    area: 'Tân Bình - Phú Nhuận - Gò Vấp (TP.HCM)',
    currentTemp: 2.9,
    minTemp: 2.1,
    maxTemp: 4.0,
    status: 'completed',
    departureTime: '08:30, 08/10/2026',
  },
  {
    id: 'trip-06',
    tripCode: 'CH-2610-06',
    driverName: 'Đặng Ngọc Sơn',
    driverPhone: '0984 555 888',
    plateNumber: '29H-118.90',
    ordersCount: 4,
    area: 'Thanh Xuân - Hà Đông (Hà Nội)',
    currentTemp: 3.5,
    minTemp: 2.6,
    maxTemp: 4.2,
    status: 'departed',
    departureTime: '15:15, 08/10/2026',
  },
]

export const MOCK_TEMP_LOGS: TempLogEntry[] = [
  { id: 'log-01', time: '13:00', tripCode: 'CH-2610-01', sensorId: 'SENSOR-A1', temperature: 2.8, humidity: 82, status: 'normal' },
  { id: 'log-02', time: '13:30', tripCode: 'CH-2610-01', sensorId: 'SENSOR-A1', temperature: 3.1, humidity: 80, status: 'normal' },
  { id: 'log-03', time: '14:00', tripCode: 'CH-2610-01', sensorId: 'SENSOR-A1', temperature: 3.5, humidity: 81, status: 'normal' },
  { id: 'log-04', time: '14:30', tripCode: 'CH-2610-01', sensorId: 'SENSOR-A1', temperature: 4.2, humidity: 79, status: 'normal' },
  { id: 'log-05', time: '15:00', tripCode: 'CH-2610-01', sensorId: 'SENSOR-A1', temperature: 3.2, humidity: 80, status: 'normal' },
  { id: 'log-06', time: '13:00', tripCode: 'CH-2610-04', sensorId: 'SENSOR-D4', temperature: 4.5, humidity: 78, status: 'normal' },
  { id: 'log-07', time: '13:45', tripCode: 'CH-2610-04', sensorId: 'SENSOR-D4', temperature: 6.8, humidity: 85, status: 'warning', note: 'Mở cửa thùng giao hàng đợt 1' },
  { id: 'log-08', time: '14:15', tripCode: 'CH-2610-04', sensorId: 'SENSOR-D4', temperature: 8.6, humidity: 88, status: 'critical', note: 'Cảnh báo: Nhiệt độ vượt 8°C' },
  { id: 'log-09', time: '14:45', tripCode: 'CH-2610-04', sensorId: 'SENSOR-D4', temperature: 7.9, humidity: 84, status: 'warning', note: 'Máy lạnh tăng cường công suất' },
]

export const SHIPPING_POLICY_CONSTANTS = {
  standardDeliveryFee: 25000,
  chilledDeliveryFee: 45000,
  freeShippingThreshold: 500000,
  coldPackagingFee: 15000,
  freeColdPackagingThreshold: 300000,
  safeTempRangeMin: 2,
  safeTempRangeMax: 8,
}

export const MOCK_SHIPMENT_INFO: Record<string, DriverInfo> = {
  'GHP-889120': {
    name: 'Nguyễn Văn Hùng',
    phone: '0914 888 292',
    plateNumber: '29C-881.92',
    vehicleType: 'Xe tải đông lạnh Isuzu QKR 1.9 tấn',
    compartmentTemp: 3.2,
    tempSafeRange: '2–8°C',
    lastTelemetryTime: '15:10 (vừa cập nhật 2 phút trước)',
  },
}

export const getDriverInfo = (orderNumber: string): DriverInfo => {
  return (
    MOCK_SHIPMENT_INFO[orderNumber] || {
      name: 'Nguyễn Văn Hùng',
      phone: '0914 888 292',
      plateNumber: '29C-881.92',
      vehicleType: 'Xe tải lạnh chuyên dụng',
      compartmentTemp: 3.2,
      tempSafeRange: '2–8°C',
      lastTelemetryTime: 'Vừa cập nhật',
    }
  )
}
