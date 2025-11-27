import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import DevicesTab from '@/components/DevicesTab';
import MonitoringTab from '@/components/MonitoringTab';
import SettingsTab from '@/components/SettingsTab';
import LogsTab from '@/components/LogsTab';

interface Device {
  id: string;
  name: string;
  type: string;
  status: boolean;
  icon: string;
  value?: number;
}

interface LogEntry {
  timestamp: string;
  level: string;
  action: string;
  device_id: string | null;
  device_name: string | null;
  message: string;
  request_id: string;
}

const API_URL = 'https://functions.poehali.dev/df787944-953c-42bf-bf1a-fb832f40acbd';

export default function Index() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [esp32Status, setEsp32Status] = useState({
    connected: true,
    uptime: '12:34:56',
    signal: 85,
    memory: 62,
    ip_address: '192.168.1.100',
    mac_address: 'A4:CF:12:8E:5F:23',
    firmware_version: 'v2.4.1',
    wifi_ssid: 'SmartHome_5G',
    mqtt_server: 'mqtt.home.local:1883'
  });
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetchDevices();
    fetchESP32Status();
    fetchLogs();
    const interval = setInterval(() => {
      fetchDevices();
      fetchESP32Status();
      fetchLogs();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}?endpoint=devices`);
      const data = await response.json();
      setDevices(data.devices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setLoading(false);
    }
  };

  const fetchESP32Status = async () => {
    try {
      const response = await fetch(`${API_URL}?endpoint=status`);
      const data = await response.json();
      setEsp32Status(data.esp32);
    } catch (error) {
      console.error('Error fetching ESP32 status:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}?endpoint=logs&limit=50`);
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const toggleDevice = async (id: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', device_id: id })
      });
      const data = await response.json();
      if (data.success) {
        setDevices(devices.map(device => 
          device.id === id ? data.device : device
        ));
      }
    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };

  const updateDeviceValue = async (id: string, value: number) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_value', device_id: id, value })
      });
      const data = await response.json();
      if (data.success) {
        setDevices(devices.map(device => 
          device.id === id ? data.device : device
        ));
      }
    } catch (error) {
      console.error('Error updating device value:', error);
    }
  };

  const handleRestart = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restart' })
      });
      const data = await response.json();
      if (data.success) {
        alert('ESP32 перезагружается...');
      }
    } catch (error) {
      console.error('Error restarting ESP32:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F1535] to-[#0A0E27] flex items-center justify-center">
        <div className="text-primary text-2xl neon-glow">Подключение к ESP32...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F1535] to-[#0A0E27] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-primary neon-glow mb-2">
              SMART HOME
            </h1>
            <p className="text-muted-foreground">Панель управления ESP32</p>
          </div>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/30 neon-border px-6 py-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${esp32Status.connected ? 'bg-primary animate-pulse-glow' : 'bg-destructive'}`} />
              <div>
                <p className="text-xs text-muted-foreground">ESP32 Status</p>
                <p className="text-sm font-bold text-primary">{esp32Status.connected ? 'ONLINE' : 'OFFLINE'}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-primary/30 mb-6">
            <TabsTrigger value="devices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Grid3x3" className="mr-2" size={16} />
              Устройства
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Activity" className="mr-2" size={16} />
              Мониторинг
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Settings" className="mr-2" size={16} />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ScrollText" className="mr-2" size={16} />
              Логи
            </TabsTrigger>
          </TabsList>

          <DevicesTab 
            devices={devices} 
            esp32Status={esp32Status} 
            toggleDevice={toggleDevice} 
            updateDeviceValue={updateDeviceValue} 
          />
          
          <MonitoringTab esp32Status={esp32Status} />
          
          <SettingsTab esp32Status={esp32Status} handleRestart={handleRestart} />
          
          <LogsTab logs={logs} />
        </Tabs>
      </div>
    </div>
  );
}
