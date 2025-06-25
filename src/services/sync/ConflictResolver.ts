
export class ConflictResolver {
  static resolveTaskConflicts(localTasks: any[], remoteTasks: any[]): any[] {
    // Simple merge strategy - prefer remote data for now
    const mergedTasks = [...remoteTasks];
    
    // Add any local tasks that don't exist remotely
    localTasks.forEach(localTask => {
      const exists = remoteTasks.find(remoteTask => 
        remoteTask.id === localTask.id || 
        (remoteTask.task_id === localTask.task_id && remoteTask.task_date === localTask.task_date)
      );
      
      if (!exists) {
        mergedTasks.push(localTask);
      }
    });
    
    return mergedTasks;
  }

  static resolveStreakConflicts(localStreak: any, remoteStreak: any): any {
    // Prefer the streak with the latest activity date
    if (!localStreak) return remoteStreak;
    if (!remoteStreak) return localStreak;
    
    const localDate = new Date(localStreak.lastActivityDate || 0);
    const remoteDate = new Date(remoteStreak.lastActivityDate || 0);
    
    return localDate > remoteDate ? localStreak : remoteStreak;
  }
}
