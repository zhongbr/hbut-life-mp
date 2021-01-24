export interface Subject {
    credit: number;
    grade: number;
}

export function GpaHBUT(subjects: Subject[]): number[] {
    let sumCredits = 0, sumMultiCreditsScores = 0;
    subjects.forEach(subject => {
        sumCredits += subject.credit;
        sumMultiCreditsScores += subject.credit * (subject.grade > 60 ? (subject.grade/10-5):0);
    })
    return [sumCredits, sumMultiCreditsScores/sumCredits];
}