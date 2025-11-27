import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Device {
  id: string;
  name: string;
  type: string;
  status: boolean;
  icon: string;
  value?: number;
}

interface ESP32Status {
  connected: boolean;
  uptime: string;
  signal: number;
  memory: number;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  wifi_ssid: string;
  mqtt_server: string;
}

interface DevicesTabProps {
  devices: Device[];
  esp32Status: ESP32Status;
  toggleDevice: (id: string) => void;
  updateDeviceValue: (id: string, value: number) => void;
}

export default function DevicesTab({ devices, esp32Status, toggleDevice, updateDeviceValue }: DevicesTabProps) {
  return (
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
  );
}
