/**
 * Application copy constants with unicode-escaped Korean text.
 * Using \uXXXX escapes prevents editor encoding corruption.
 * 
 * Team-approved exact escapes - do not modify.
 */

// 사이타로
export const BRAND_NAME = '\uC0AC\uC774\uD0C0\uB85C';

// 너는 나한테 어떤 사람?
export const LANDING_TITLE = '\uB108\uB294\u0020\uB098\uD55C\uD14C\u0020\uC5B4\uB5A4\u0020\uC0AC\uB78C\u003F';

// 타로 한 장으로 말해줘. 링크 열고 네 카드도 뽑아봐.
export const LANDING_DESCRIPTION = '\uD0C0\uB85C\u0020\uD55C\u0020\uC7A5\uC73C\uB85C\u0020\uB9D0\uD574\uC918\u002E\u0020\uB9C1\uD06C\u0020\uC5F4\uACE0\u0020\uB124\u0020\uCE74\uB4DC\uB3C4\u0020\uBF51\uC544\uBD50\u002E';

// 타로 한 장으로 말해줘 (derived from LANDING_DESCRIPTION)
export const LANDING_TAGLINE = '\uD0C0\uB85C\u0020\uD55C\u0020\uC7A5\uC73C\uB85C\u0020\uB9D0\uD574\uC918';

// Fixed question for all room creations (PM-approved canonical string)
// 너는 나한테 어떤 사람?
export const FIXED_ROOM_QUESTION = '\uB108\uB294\u0020\uB098\uD55C\uD14C\u0020\uC5B4\uB5A4\u0020\uC0AC\uB78C\u003F';

// Build version marker to force cache invalidation
export const BUILD_VERSION = '2026-09-12-001';
