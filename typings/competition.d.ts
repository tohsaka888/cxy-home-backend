declare namespace Competition {

  type Participant = {
    username: string;
    email: string;
  }

  type CompetitionImage = {
    intro: string;
    url: string;
  }

  type Award = {
    award: string;
  }

  type AwardSetting = {
    award: string;
    limit: number;
  }

  type Winner = Participant & Award;

  type Creator = Participant;

  type Info = {
    place: string;
    way: string;
    limit: number;
    signUpStart: string;
    signUpEnd: string;
    time: string;
    duration: string;
  }

  type Competition = {
    name: string;
    createdTime: string;
    updatedTime: string;
    participants: Participant[];
    winners: Winner[];
    intro: string;
    info: Info;
    banners: UploadFile<any>[];
    creator: Creator;
    awardSetting: AwardSetting[];
  }
}
