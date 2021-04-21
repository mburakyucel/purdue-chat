import { TestBed } from '@angular/core/testing';

import { ChatGuard } from './chat.guard';

describe('ChatGuard', () => {
  let guard: ChatGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChatGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
