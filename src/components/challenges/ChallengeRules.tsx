
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Clock, Trophy, Target, Shield, Award } from 'lucide-react';

export const ChallengeRules: React.FC = () => {
  const rules = [
    {
      icon: <Target className="h-4 w-4 text-chichi-orange" />,
      text: "Only 1 active challenge at a time"
    },
    {
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      text: "Challenge starts immediately when accepted"
    },
    {
      icon: <Trophy className="h-4 w-4 text-green-500" />,
      text: "Points are based on CHICHI's daily task completions"
    },
    {
      icon: <Shield className="h-4 w-4 text-red-500" />,
      text: "Invite links expire after 24 hours"
    },
    {
      icon: <Award className="h-4 w-4 text-purple-500" />,
      text: "Winning 3 challenges may unlock a badge (coming soon)"
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-5 w-5 text-chichi-orange" />
          Challenge Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start gap-2">
              {rule.icon}
              <span className="text-sm text-gray-700">{rule.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
