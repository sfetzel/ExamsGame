import { ExamsGamePage } from './app.po';

describe('exams-game App', () => {
  let page: ExamsGamePage;

  beforeEach(() => {
    page = new ExamsGamePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
