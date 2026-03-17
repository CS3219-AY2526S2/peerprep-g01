export default interface Question {
  questionId: string;
  questionName: string;
  topicId: number;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  publicTestCase: string;
  privateTestCase: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}
