export type items = {
  description: string;
  title: string;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  NotesDetails: undefined;
  AddNotes?: { isEdit: boolean; item: items };
};
