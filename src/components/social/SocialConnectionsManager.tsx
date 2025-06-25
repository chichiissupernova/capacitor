
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSocialConnections } from '@/hooks/useSocialConnections';
import { Loader2, CheckCircle, XCircle, Instagram, Twitter, Facebook, Youtube, Linkedin } from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
];

export function SocialConnectionsManager() {
  const { connections, isLoading, connectAccount, disconnectAccount } = useSocialConnections();
  const [connecting, setConnecting] = useState<string | null>(null);
  
  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    await connectAccount(platformId, true); // Using mock data
    setConnecting(null);
  };
  
  const handleDisconnect = async (connectionId: string) => {
    await disconnectAccount(connectionId);
  };
  
  const isConnected = (platformId: string) => {
    return connections.some(conn => conn.platform === platformId);
  };
  
  const getConnection = (platformId: string) => {
    return connections.find(conn => conn.platform === platformId);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>
          Connect your social media accounts to enable automatic posting
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {PLATFORMS.map(platform => {
              const connected = isConnected(platform.id);
              const connection = getConnection(platform.id);
              const Icon = platform.icon;
              
              return (
                <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      {connected && connection?.username && (
                        <p className="text-sm text-muted-foreground">{connection.username}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {connecting === platform.id ? (
                      <Button disabled variant="ghost">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </Button>
                    ) : connected ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => connection && handleDisconnect(connection.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        onClick={() => handleConnect(platform.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between p-4 text-sm">
        <p className="text-muted-foreground">
          Connected accounts: {connections.length}/{PLATFORMS.length}
        </p>
      </CardFooter>
    </Card>
  );
}
