interface TestCaseEntry {
  input: string;
  output: string;
}

export default interface Question {
  questionId: string;
  questionName: string;
  topicId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  publicTestCase: TestCaseEntry[];
  privateTestCase: TestCaseEntry[];
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}
