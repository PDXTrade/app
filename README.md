# TradePXD
A Portland, OR local bartering app that is purely items (no exchange of $$).

By Grace Provost and Micheal Warren

Objective
===
In one week on a team of two people, create an app with:
  - Responsive web design using a combination of CSS Grid and Flexbox.
  - Semantic, accessible markup.
  - Component and router architecture.
  - Vanilla js, css, html
  - Webpack for development and production builds
  - Allows users to sign up and sign in, using Firebase authentication system.
  - Stores user data using:
    - Realtime Firebase Database
    - Firebase Cloud Storage for files and images
  - Protection in parts of the app from unauthorized access
  - Implement responsive image loading strategies using cloudinary
  - The principles of Chapter 3 of Don't Make Me Think! to make body copy scan-friendly.
  - Subtle CSS animations could aid usability.

Steps Taken
===

We started with researching direct and indirect competitors to our app idea. We used craigslist, offerup, and letgo as example apps. We created user personas and user stories to help guide our design choices. We created a UX strategy document. We sketched what the routes and subroutes of the app would look like, structured our components, and began building the app one component at a time. When creating a component, we started with the html, then created functionality. User authentication was created using Firebase auth. We created private and public routes based on whether a user was logged in or not. User-generated content was captured and sent to Firebase database. We set event listeners on Firebase nodes to watch for value changes, children added / removed / changed.

Here are some demos of the app:
- [Category Nav](TradePDX_categories_demo.gif)
- [Edit sequence](TradePDX_edit_demo.gif)
- [Trade sequence](TradePDX_trade_demo.gif)

Reflection / Changes
===

This was a fast-paced, demanding experience creating a full-fledged application with only two people. Learning to work with firebase was exciting and challenging. The application is able to respond and update instantly due to firebase's live-updating features. This makes for a fun user experience with real-time bartering.

In the future:
- functionality that alerts users when they have changes to ongoing trades
- only one trade can exist between two people at one time, no matter who starts the trade
- archived trades
- expose user contact info after trade is accepted
- inactivate the accept button if a new item is selected in trade
