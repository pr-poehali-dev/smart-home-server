import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

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

interface MonitoringTabProps {
  esp32Status: ESP32Status;
}

export default function MonitoringTab({ esp32Status }: MonitoringTabProps) {
  const temperatureData = [20, 21, 22, 23, 22, 21, 22, 23, 24, 23, 22, 21];
  const energyData = [45, 52, 48, 65, 55, 70, 62, 58, 60, 55, 50, 48];

  return (
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
  );
}
