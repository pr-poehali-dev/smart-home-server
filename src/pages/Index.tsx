import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Device {
  id: string;
  name: string;
  type: string;
  status: boolean;
  icon: string;
  value?: number;
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

  useEffect(() => {
    fetchDevices();
    fetchESP32Status();
    const interval = setInterval(() => {
      fetchDevices();
      fetchESP32Status();
    }, 5000);
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

  const temperatureData = [20, 21, 22, 23, 22, 21, 22, 23, 24, 23, 22, 21];
  const energyData = [45, 52, 48, 65, 55, 70, 62, 58, 60, 55, 50, 48];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F1535] to-[#0A0E27] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <Card 
                  key={device.id}
                  className={`bg-card/50 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 ${
                    device.status 
                      ? 'border-primary/50 neon-border' 
                      : 'border-muted/30'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          device.status ? 'bg-primary/20 neon-border' : 'bg-muted/20'
                        }`}>
                          <Icon 
                            name={device.icon as any} 
                            className={device.status ? 'text-primary' : 'text-muted-foreground'} 
                            size={24}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{device.name}</h3>
                          <p className="text-xs text-muted-foreground">{device.type}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={device.status}
                        onCheckedChange={() => toggleDevice(device.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    {device.status && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {device.type === 'climate' ? 'Температура' : 
                             device.type === 'light' ? 'Яркость' : 
                             device.type === 'audio' ? 'Громкость' : 'Уровень'}
                          </span>
                          <span className="font-bold text-primary">
                            {device.value}{device.type === 'climate' ? '°C' : '%'}
                          </span>
                        </div>
                        <Slider
                          value={[device.value || 0]}
                          onValueChange={(value) => updateDeviceValue(device.id, value[0])}
                          max={device.type === 'climate' ? 30 : 100}
                          min={device.type === 'climate' ? 16 : 0}
                          step={1}
                          className="[&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Активно</p>
                    <p className="text-2xl font-bold text-primary neon-glow">
                      {devices.filter(d => d.status).length}/{devices.length}
                    </p>
                  </div>
                  <Icon name="Power" className="text-primary" size={32} />
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-secondary/30 neon-border-purple p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Сигнал</p>
                    <p className="text-2xl font-bold text-secondary">{esp32Status.signal}%</p>
                  </div>
                  <Icon name="Wifi" className="text-secondary" size={32} />
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-accent/30 neon-border-orange p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Память</p>
                    <p className="text-2xl font-bold text-accent">{esp32Status.memory}%</p>
                  </div>
                  <Icon name="HardDrive" className="text-accent" size={32} />
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                    <p className="text-lg font-bold text-foreground">{esp32Status.uptime}</p>
                  </div>
                  <Icon name="Clock" className="text-primary" size={32} />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Icon name="Thermometer" className="text-primary" size={20} />
                    Температура
                  </h3>
                  <span className="text-2xl font-bold text-primary neon-glow">22°C</span>
                </div>
                <div className="h-40 flex items-end gap-2">
                  {temperatureData.map((temp, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t transition-all hover:opacity-80 neon-border"
                      style={{ height: `${(temp / 24) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>12ч назад</span>
                  <span>Сейчас</span>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-secondary/30 neon-border-purple p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Icon name="Zap" className="text-secondary" size={20} />
                    Энергопотребление
                  </h3>
                  <span className="text-2xl font-bold text-secondary">58W</span>
                </div>
                <div className="h-40 flex items-end gap-2">
                  {energyData.map((energy, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-secondary/50 to-secondary rounded-t transition-all hover:opacity-80 neon-border-purple"
                      style={{ height: `${(energy / 70) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>12ч назад</span>
                  <span>Сейчас</span>
                </div>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border border-accent/30 neon-border-orange p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="Activity" className="text-accent" size={20} />
                Системная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">CPU загрузка</span>
                      <span className="text-sm font-bold text-accent">45%</span>
                    </div>
                    <Progress value={45} className="h-2 bg-muted [&>div]:bg-accent" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">RAM использование</span>
                      <span className="text-sm font-bold text-accent">{esp32Status.memory}%</span>
                    </div>
                    <Progress value={esp32Status.memory} className="h-2 bg-muted [&>div]:bg-accent" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">WiFi сигнал</span>
                      <span className="text-sm font-bold text-primary">{esp32Status.signal}%</span>
                    </div>
                    <Progress value={esp32Status.signal} className="h-2 bg-muted [&>div]:bg-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Flash память</span>
                      <span className="text-sm font-bold text-secondary">38%</span>
                    </div>
                    <Progress value={38} className="h-2 bg-muted [&>div]:bg-secondary" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon name="Cpu" className="text-primary" size={20} />
                Конфигурация ESP32
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">IP адрес</label>
                    <div className="p-3 bg-muted/20 rounded-lg border border-primary/20 font-mono text-primary">
                      {esp32Status.ip_address}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">MAC адрес</label>
                    <div className="p-3 bg-muted/20 rounded-lg border border-primary/20 font-mono text-primary">
                      {esp32Status.mac_address}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Версия прошивки</label>
                    <div className="p-3 bg-muted/20 rounded-lg border border-secondary/20 font-mono text-secondary">
                      {esp32Status.firmware_version}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">WiFi SSID</label>
                    <div className="p-3 bg-muted/20 rounded-lg border border-primary/20 font-mono text-primary">
                      {esp32Status.wifi_ssid}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">MQTT сервер</label>
                    <div className="p-3 bg-muted/20 rounded-lg border border-primary/20 font-mono text-primary">
                      {esp32Status.mqtt_server}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Время работы</label>
                    <div className="p-3 bg-muted/20 rounded-lg border border-accent/20 font-mono text-accent">
                      {esp32Status.uptime}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="bg-card/50 backdrop-blur-sm border border-primary/30 hover:border-primary/50 transition-all p-4 cursor-pointer hover:scale-105 neon-border"
                onClick={handleRestart}
              >
                <div className="flex items-center gap-3">
                  <Icon name="RotateCw" className="text-primary" size={24} />
                  <div>
                    <p className="font-bold">Перезагрузка</p>
                    <p className="text-xs text-muted-foreground">Рестарт ESP32</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-secondary/30 hover:border-secondary/50 transition-all p-4 cursor-pointer hover:scale-105 neon-border-purple">
                <div className="flex items-center gap-3">
                  <Icon name="Download" className="text-secondary" size={24} />
                  <div>
                    <p className="font-bold">Обновление</p>
                    <p className="text-xs text-muted-foreground">Прошивка OTA</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-accent/30 hover:border-accent/50 transition-all p-4 cursor-pointer hover:scale-105 neon-border-orange">
                <div className="flex items-center gap-3">
                  <Icon name="Database" className="text-accent" size={24} />
                  <div>
                    <p className="font-bold">Backup</p>
                    <p className="text-xs text-muted-foreground">Сохранить конфиг</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}