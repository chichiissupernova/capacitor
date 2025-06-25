
export class LocalStorageManager {
  static getTasks(userId: string): any[] {
    try {
      const key = `tasks_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting tasks from localStorage:', error);
      return [];
    }
  }

  static setTasks(userId: string, tasks: any[]): void {
    try {
      const key = `tasks_${userId}`;
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error setting tasks in localStorage:', error);
    }
  }

  static getStreak(userId: string): any {
    try {
      const key = `streak_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting streak from localStorage:', error);
      return null;
    }
  }

  static setStreak(userId: string, streak: any): void {
    try {
      const key = `streak_${userId}`;
      localStorage.setItem(key, JSON.stringify(streak));
    } catch (error) {
      console.error('Error setting streak in localStorage:', error);
    }
  }
}
