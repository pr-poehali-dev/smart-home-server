import { Card } from '@/components/ui/card';
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

interface SettingsTabProps {
  esp32Status: ESP32Status;
  handleRestart: () => void;
}

export default function SettingsTab({ esp32Status, handleRestart }: SettingsTabProps) {
  return (
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
  );
}
