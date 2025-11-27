'''
Business: API для управления ESP32 контроллером умного дома
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с данными устройств или статусом операции
'''

import json
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class DeviceType(str, Enum):
    LIGHT = 'light'
    CLIMATE = 'climate'
    SECURITY = 'security'
    BLINDS = 'blinds'
    AUDIO = 'audio'
    OUTLET = 'outlet'


@dataclass
class Device:
    id: str
    name: str
    type: DeviceType
    status: bool
    icon: str
    value: Optional[int] = None


@dataclass
class ESP32Status:
    connected: bool
    uptime: str
    signal: int
    memory: int
    ip_address: str
    mac_address: str
    firmware_version: str
    wifi_ssid: str
    mqtt_server: str


devices_storage: List[Device] = [
    Device(id='1', name='Освещение', type=DeviceType.LIGHT, status=True, icon='Lightbulb', value=75),
    Device(id='2', name='Климат-контроль', type=DeviceType.CLIMATE, status=True, icon='Thermometer', value=22),
    Device(id='3', name='Безопасность', type=DeviceType.SECURITY, status=False, icon='Shield', value=100),
    Device(id='4', name='Жалюзи', type=DeviceType.BLINDS, status=False, icon='Blinds', value=50),
    Device(id='5', name='Музыка', type=DeviceType.AUDIO, status=True, icon='Music', value=60),
    Device(id='6', name='Розетки', type=DeviceType.OUTLET, status=True, icon='Plug', value=100)
]

esp32_status = ESP32Status(
    connected=True,
    uptime='12:34:56',
    signal=85,
    memory=62,
    ip_address='192.168.1.100',
    mac_address='A4:CF:12:8E:5F:23',
    firmware_version='v2.4.1',
    wifi_ssid='SmartHome_5G',
    mqtt_server='mqtt.home.local:1883'
)


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Device-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        endpoint = query_params.get('endpoint', 'devices')
        
        if endpoint == 'devices':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'devices': [asdict(d) for d in devices_storage],
                    'timestamp': context.request_id
                }),
                'isBase64Encoded': False
            }
        
        elif endpoint == 'status':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'esp32': asdict(esp32_status),
                    'timestamp': context.request_id
                }),
                'isBase64Encoded': False
            }
        
        elif endpoint == 'device':
            device_id = query_params.get('id')
            if not device_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Device ID required'}),
                    'isBase64Encoded': False
                }
            
            device = next((d for d in devices_storage if d.id == device_id), None)
            if not device:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Device not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(asdict(device)),
                'isBase64Encoded': False
            }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'toggle':
            device_id = body_data.get('device_id')
            device = next((d for d in devices_storage if d.id == device_id), None)
            
            if not device:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Device not found'}),
                    'isBase64Encoded': False
                }
            
            device.status = not device.status
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'device': asdict(device),
                    'message': f'Device {device.name} toggled to {device.status}'
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'update_value':
            device_id = body_data.get('device_id')
            new_value = body_data.get('value')
            
            if new_value is None:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Value required'}),
                    'isBase64Encoded': False
                }
            
            device = next((d for d in devices_storage if d.id == device_id), None)
            
            if not device:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Device not found'}),
                    'isBase64Encoded': False
                }
            
            device.value = new_value
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'device': asdict(device),
                    'message': f'Device {device.name} value updated to {new_value}'
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'restart':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'message': 'ESP32 restart initiated'
                }),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
