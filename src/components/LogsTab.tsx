import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface LogEntry {
  timestamp: string;
  level: string;
  action: string;
  device_id: string | null;
  device_name: string | null;
  message: string;
  request_id: string;
}

interface LogsTabProps {
  logs: LogEntry[];
}

export default function LogsTab({ logs }: LogsTabProps) {
  const levelColors = {
    'INFO': 'border-primary/30 bg-primary/5',
    'SUCCESS': 'border-primary/50 bg-primary/10 neon-border',
    'WARNING': 'border-accent/50 bg-accent/10 neon-border-orange',
    'ERROR': 'border-destructive/50 bg-destructive/10'
  };
  
  const levelIcons = {
    'INFO': 'Info',
    'SUCCESS': 'CheckCircle',
    'WARNING': 'AlertTriangle',
    'ERROR': 'XCircle'
  };

  const levelTextColors = {
    'INFO': 'text-primary',
    'SUCCESS': 'text-primary',
    'WARNING': 'text-accent',
    'ERROR': 'text-destructive'
  };

  return (
    <TabsContent value="logs" className="space-y-6 animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="ScrollText" className="text-primary" size={20} />
            Журнал команд ESP32
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="RefreshCw" className="text-primary animate-spin" size={16} />
            <span>Обновление каждые 3 сек</span>
          </div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Info" className="mx-auto mb-3" size={48} />
              <p>Пока нет записей в логе</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${levelColors[log.level as keyof typeof levelColors] || 'border-muted/30'}`}
              >
                <div className="flex items-start gap-3">
                  <Icon 
                    name={levelIcons[log.level as keyof typeof levelIcons] as any || 'Circle'} 
                    className={levelTextColors[log.level as keyof typeof levelTextColors] || 'text-muted-foreground'}
                    size={20}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${levelTextColors[log.level as keyof typeof levelTextColors] || 'text-foreground'}`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.action}
                        </span>
                        {log.device_name && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            {log.device_name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      req: {log.request_id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Всего записей</p>
              <p className="text-2xl font-bold text-primary neon-glow">{logs.length}</p>
            </div>
            <Icon name="FileText" className="text-primary" size={32} />
          </div>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-primary/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Успешных</p>
              <p className="text-2xl font-bold text-primary">
                {logs.filter(l => l.level === 'SUCCESS').length}
              </p>
            </div>
            <Icon name="CheckCircle" className="text-primary" size={32} />
          </div>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-destructive/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Ошибок</p>
              <p className="text-2xl font-bold text-destructive">
                {logs.filter(l => l.level === 'ERROR').length}
              </p>
            </div>
            <Icon name="XCircle" className="text-destructive" size={32} />
          </div>
        </Card>
      </div>
    </TabsContent>
  );
}
