
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, CheckCircle, Zap } from 'lucide-react';

interface JoinSuccessModalProps {
  isOpen: boolean;
  challengerName: string;
  challengeDays: number;
}

export function JoinSuccessModal({ isOpen, challengerName, challengeDays }: JoinSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500" />
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🎉 CHALLENGE JOINED!
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center space-y-6 pt-4">
            <div className="bg-white border border-green-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-orange-500" />
                <span className="text-xl font-bold text-gray-800">Battle Ready!</span>
              </div>
              <p className="text-lg text-gray-700 mb-3">
                You're now in an epic showdown with{' '}
                <span className="font-bold text-chichi-orange">{challengerName}</span>!
              </p>
              <p className="text-base text-gray-600 mb-4">
                Battle duration: <span className="font-semibold text-chichi-purple">{challengeDays} days</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-6 w-6 text-chichi-orange" />
                <span className="font-bold text-orange-800">THE BATTLE BEGINS NOW!</span>
              </div>
              <p className="text-sm font-medium text-orange-700">
                Complete your daily CHICHI tasks to earn points and claim victory in this creator showdown!
              </p>
            </div>
            
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg">
              🚀 Redirecting to your battle arena in 3 seconds...
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
