export type Database = {
  public: {
    Tables: {
      // Add your database table types here
      // Example:
      // users: {
      //   Row: {
      //     id: string;
      //     email: string;
      //     created_at: string;
      //   };
      //   Insert: {
      //     id?: string;
      //     email: string;
      //     created_at?: string;
      //   };
      //   Update: {
      //     id?: string;
      //     email?: string;
      //     created_at?: string;
      //   };
      // };
    };
    Views: {
      // Add your database view types here
    };
    Functions: {
      // Add your database function types here
    };
    Enums: {
      // Add your database enum types here
    };
  };
};
