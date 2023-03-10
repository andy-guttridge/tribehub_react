# TribeHub

## Project goals
TribeHub is designed to be a virtual equivalent to the typical wall planner a family might put up in a kitchen or other communal area. The primary goals of the web app are to:
1) Provide busy families with a single, central hub around which to plan and organise busy lives and schedules. This should include calendar/event scheduling functionality similar to a family wall planner, enabling events to be scheduled for one or multiple family members, and viewed by all the family.
2) Deliver a simple and intuitive user experience, suitable for adults and tech literate children aged 10+. 
3) Offer a minimal set of impactful features chosen in order to deliver a useful app within an achievable development timeframe, while laying a solid foundation for additional features in the future.

## Table of contents

## User stories
Themes, epics, user stories and testing outcomes are documented in the `user_stories` worksheet of [this Google sheet](https://docs.google.com/spreadsheets/d/11wcDHeqr85VaHXdJjATod_WECRY03IRUlGgT_L_ikIw/edit#gid=0).

### Themes
Themes were developed using the project goals as a starting point. These included:

- Account management - necessary to support the use of the app on an individual basis and to group users together into a 'tribe' to support goal 1.
- Calendar/event scheduling - central to the requirement to enable the key functionality required by goal 1.
- Family contacts - chosen as a feature with low implementation over-head to be included in an initial set of minimal functionality in support of goal 3.
- Shopping lists - chosen as a 'nice to have' feature which could be implemented for version 1 of the project given sufficient time, but which is also a discrete area of functionality which could be added later as per goal 3.
- Meal planning - also chosen as a 'nice to have' feature which could be added in a future version of the app, aligning with goal 3. This functionality would likely build on that of the shopping lists feature, and was therefore regarded as unlikely to be included in version 1.
- User feedback and information - required to support goal 2.
- Search and filter - required to support goal 2.

### Epics
Themes were then refined into the following epics:

- Account management
  - Account registration
  - Account sign-in
  - Account sign-out
  - Account deletion
  - User profile
- Calendar/event scheduling
  - Scheduling events
  - Event responses
  - Event deletion
  - Editing events
- Family contacts
  - Adding family contacts
  - Amending family contacts
  - Deleting family contacts
  - Viewing family contacts
- Shopping lists
  - Creating shopping lists
  - Amending shopping lists
  - Deleting shopping lists
- Meal planning
  - Creating a meal plan
  - Editing a meal plan
  - Deleting a meal plan
- User feedback/information
  - Notifications
  - User feedback
- Search and filter
  - Searching calendar events
  - Searching contact list
  - Searching shopping lists
  - Searching meal plans

### User stories
User stories required to implement each epic were created. These were categorised according to whether they were 'must have' features required to implement a Minimum Viable Product (MVP).
Please see the [Google sheet](https://docs.google.com/spreadsheets/d/11wcDHeqr85VaHXdJjATod_WECRY03IRUlGgT_L_ikIw/edit#gid=0) for detail.

## Agile development methodology
GitHub issues and projects were used to document and track an agile development approach.
A GitHub issue was created for each user story, with a label to indicate if they were required for the MVP. A GitHub milestone was created to represent the product backlog. All user stories were initially added to the product backlog.

Development work was scheduled using a series of iterations each with a timebox of three working days, representing a total 16 story points (although the duration of each iteration in calendar days was variable due to fitting the three working days around work and other commitments).

A GitHub project board was created for each iteration, and user stories moved from the product backlog into the relevant iteration as each cycle of work began. User stories were labelled as 'must have', 'could have' or 'should have' for goals for that specific iteration, and assigned story point values.  Story points for 'must have' user stories never exceeded 9 (60%). Some iterations also contained 'tasks' for activity not represented as user stories, such as setup/configuration and design/styling.

A project kanban board was used to track progress, with user stories moved between 'Todo', 'In Progress' and 'Done' columns as appropriate. For example, the iteration 4 project board was captured at the start, in the middle and at the end:

<p align="center">
    <img src="readme_assets/iteration3_start_kanban.png" width=600>
    <img src="readme_assets/iteration3_mid_kanban.png" width=600>
    <img src="readme_assets/iteration3_end_kanban.png" width=600>
</p>

The project boards in their final form can be accessed at [TribeHub GitHub Project Boards](https://github.com/andy-guttridge/tribehub_react/projects?query=is%3Aopen).

Additionally, Notion was used to note and track other miscellanious tasks as they arose during development. The Notion tasks list can be accessed [here](https://www.notion.so/968f16ba28c94562b34767b616e31cd5?v=58c1cd844948493aa55f70f9458130b2&p=f16bfd5c78cd4bc4b4370cf6dd944a09&pm=s).

## Planning

### Mockups

Wireframes were produced based on those user stories that had been identified as required for the MVP.
These were based on a mobile view of the site, as TribeHub is very much a mobile first web app.

<p align="center">
    <img src="readme_assets/pp5_wireframes.png" width=600>
</p>
<p align="center">
    <a href="readme_assets/pp5_wireframes.pdf" target="_rel">Link to fullsize wireframes</a>
</p>
The wireframes were critical to the development of the site and were invaluable in terms of mapping and visualising the 'flow' through the site and the UI, however the final product varies from the wireframes in a number of respects, largely for technical and/or usablility reasons:

- There is no modal dialog to confirm the user wishes to sign-out. This was omitted as signing out is a non-destructive action and sign-in requirements are minimal, so an additional modal was deemed unnecessary. 
- There is no modal dialog to confirm the user wishes to decline an event. This was not included because the default state of an event is that users have not accepted the invitation. They can either choose not to accept the invitation (no action required), or accept it, and the UI includes a 'going/not going' button directly from notifications and/or calendar events, making it quicker and easier for the user to provide an initial response or change their minds from the notification or event than from a modal. This may be revisited in future if a more fully featured 'accept/decline' system is implemented (see future improvements below).
- Forms to add and edit events, contacts and tribe member details are presented in line with the other webpage elements, rather than in modals. Once implementation started, it quickly became apparent that enclosing such forms in modals could negatively impact usability on cramped mobile screens.
- Rather than have a separate button to delete a tribe, deletion of a tribe is tied to the deletion of the tribe administrator's account - i.e., if the tribe administrator wants to close all accounts associated with the tribe, they simply close their own account and all other accounts associated with the tribe are also closed. This approach was chosen to simplify the user experience. The tribe administrator can still close accounts of individual tribe members.
- A `select` form elements is used to invite tribe members when creating a new calendar event, rather than the avatar based interface depicted on the wireframes. This approach was chosen to speed development and implement the 'add new event' functionality within the required timeframe. This could be revisited/enhanced in future.
- The wireframes depict calendar events for a given day rendered in a 'popover' style element attached to the calendar cell. In the final implementation, events are rendered in a list under the calendar. The primary reason for this was again in order to deliver the MVP functionality within the required timeframe, however implementing a scrollable list underneath the calendar might also provide a better experience for mobile by virtue of being less cramped (for example, this approach is used within the iPhone Calendar app). This could be revisited in future.
- The landing page was simplified to include a hero image and a one line description of the site, in order not to provide users with a cluttered view of the site.
- The search forms for events and contacts are initially hidden and can be opened using a search button, unlike on the wireframes. This is because the final events search form is considerably larger than suggested on the wireframe, and not keeping it hidden in the initial page load state would significantly clutter the Tribe Home page. While the contacts search form is much smaller, the same approach was adopted for UI consistency.
- 'Accordians' were not used for the 'Settings' page, and Settings was renamed to 'My Account'. It quickly became apparent that using accordians here would lead to a very sparse screen, even on mobile, and would therefore introduce an additional layer of UI interaction with little or no benefit. The 'Settings' page title was changed after comments from family testers who felt that 'My Account' would be a better fit for the content.
- A coloured dot with high contrast against the background colour is used on calendar cells to indicate whether there are any calendar events on a given day, rather than colour coding. This is because the calendar already uses several colours to indicate the current day, whether a cell is selected etc, and introducing another colour to convey such key data to the user could cause accessability challenges for colour blind users.

### Data models
Data models were planned alongside the wireframes. These are documented in the read-me for the [TribeHub Django Rest Framework API](https://github.com/andy-guttridge/tribehub_drf).

## Design

### Colours
The primary design aim was to create a simple and functional appearance. One of the reasons the DaisyUI component library was chosen was because it includes a simple colour theming feature, allowing the developer to define any number of colour themes composed of a small number of colours with semantic class names. This approach was ideally suited to the desire for a clean and simple site.

A white background was chosen for the site's main theme, to maximise contrast and provide a clean, straighforward and uncluttered look.
Colour palettes from [Adobe Colour Wheel](https://color.adobe.com/create) were explored. A bold pink from the ['purples' theme by Anisha Thomas](https://color.adobe.com/My%20Color%20Theme%20-%20purples-color-theme-10167596) was chosen for its vibrancy - this is used as the site's 'primary' colour to indicate clickable UI items. The 'secondary' and 'accent' colours were then chosen to complement it, using the algorithms in Adobe Colour Wheel, and then darkening the colours to increase contrast against the background.

A secondary colour scheme was chosen for the site's dark mode. The aim for dark mode was to provide an understated, muted and undistracting look, suited to low lighting conditions and provided as an alternative for users who prefer a less colourful presentation.
The primary colour for dark mode is a light sky blue, chosen to stand out against the dark background while also being a 'restful' colour. The secondary and accent colours are two different shades of grey, chosen to be unobtrusive.

The main colour palettes used for light and dark modes are:

| Colour |Light mode value   |Dark mode value   |   |   |
|---|---|---|---|---|
|  Primary - used for logo and key UI elements |  #e5006a |  #add5f7 |   |   |
| Secondary - used for logo, notifications badge and calendar highlighting  | #9c13bf  |  #e6e6e6 |   |   |
|  Accent - used for section/page headings |  #215ba6 | #d8ebf2  |   |   |
|  Neutral - used for sub-headings |   #4a4a4a |  #ffffff |   |   |
|  Base-100 - main background colour |  #fbfbfb |  #1c1c1c |   |   |
|  Base-200 - darker background colour |  #f8f8f8 | #141414  |   |   |
|  Base-300 - second darker background colour |  #d6d6d6 | #141414  |   |   |

Additionally, while colours for the primary and secondary colours (when used as backgrounds) are automatically defined by DaisyUI, these were overidden for the light theme to resolve some contrast issues highlighted by the Wave accessability validator.

Likewise, two additional CSS classes (`.CalWeekendText` and `.CalTextBlack`) were defined especially for the dark mode theme, to resolve some contrast issues with the default calendar colour for weekend days against the dark background and with the light coloured text used for some highlighted cells against the already light primary, secondary and accent colours in dark mode.

### Fonts
Google fonts were used for the project.
Fredoka One was chosen for the TribeHub logo `<h1>` element and `<h2>` headings used for the main page/section headings. The aim was to find a fun, friendly yet clear and legible font, and was selected after trying a number of possibilities suggested in this [shapegrams blog post on 'Fun Fonts for Every Season'](https://shapegrams.com/fonts/).

Nunito was chosen for `<h3>` and `<h4>` elements (used as sub-headings within major pages/sections) because it is similar to Fredoka One, but has a 'thinner' look better suited to smaller headings.

Lato was chosen as a font for all non-heading text elements, based on its popularity as a highly legible font for web text content (e.g. https://fontandswatch.com.au/fonts/lato-font/#:~:text=Lato%20Font%20comes%20in%2018,1%20billion%20audiences%20per%20day.)

## Features

### Pages
**Need to relate pages and components to the relevant user stories** (1.4)
#### Landing page with hero image
<p align="left">
    <img src="readme_assets/hero.png" width=250>
</p>

#### Registration form
<p align="left">
    <img src="readme_assets/registration.png" width=250>
</p>

#### Sign-in form
<p align="left">
    <img src="readme_assets/sign-in.png" width=250>
</p>

#### Header with welcome message, notifications menu and sign-out button
<p align="left">
    <img src="readme_assets/header.png" width=250>
</p>

#### Bottom navbar
<p align="left">
    <img src="readme_assets/bottom_nav.png" width=250>
</p>

#### Drop-down notifications menu
<p align="left">
    <img src="readme_assets/notifications.png" width=250>
</p>

#### TribeHome page with family calendar
<p align="left">
    <img src="readme_assets/tribehome.png" width=250>
</p>

#### Add event and search buttons

#### Calendar events detail displayed below calendar
<p align="left">
    <img src="readme_assets/events.png" width=250>
    <img src="readme_assets/events2.png" width=250>
</p>

#### Edit event and delete event buttons

#### Add event form
<p align="left">
    <img src="readme_assets/add_event.png" width=250>
</p>

#### Edit event form
<p align="left">
    <img src="readme_assets/edit_event.png" width=250>
</p>

#### Family contacts page
<p align="left">
    <img src="readme_assets/contacts.png" width=250>
</p>

#### Add contacts and search contacts buttons

#### Add contacts form
<p align="left">
    <img src="readme_assets/add_contacts.png" width=250>
</p>

#### Search contacts form
<p align="left">
    <img src="readme_assets/search_contacts.png" width=250>
</p>

#### Edit contact and delete contact buttons

#### Edit contact form
<p align="left">
    <img src="readme_assets/edit_contact.png" width=250>
</p>

#### Account page with My Tribe, My Profile, Change Password and Delete Account
<p align="left">
    <img src="readme_assets/account1.png" width=250>
    <img src="readme_assets/account2.png" width=250>
    <img src="readme_assets/account3.png" width=250>
</p>

#### Modal dialogs to confirm or cancel destructive actions
<p align="left">
    <img src="readme_assets/delete_event_modal.png" width=250>
    <img src="readme_assets/delete_contact_modal.png" width=250>
    <img src="readme_assets/delete_tribe_member_modal.png" width=250>
    <img src="readme_assets/delete_account_modal.png" width=250>
</p>

#### 'Single page mode' for medium and large screen sizes
<p align="left">
    <img src="readme_assets/singlepage1.png" width=500>
    <img src="readme_assets/singlepage2.png" width=500>
</p>

#### Darkmode
<p align="left">
    <img src="readme_assets/darkmode1.png" width=250>
    <img src="readme_assets/darkmode2.png" width=250>
    <img src="readme_assets/darkmode3.png" width=250>
</p>





### Components
**Need to relate pages and components to the relevant user stories** (1.4)
**Need to document re-use of components to demonstrate understanding of modern React architecture** (2.1)

### CRUD functionality

### Future improvements and features

#### Future improvements

#### Future features

## Frameworks, libraries and dependencies
**Need to document rationale for choices**

### Tailwind CSS

### DaisyUI

### React Bootstrap Icons

### React Router

### Axios

### JWT Decode

### React-Calendar

## Testing

### Manual testing

### Automated testing

### Validator testing

### W3C HTML Validator

### W3C CSS validator

### ESLint JavaScript validator

Issues corrected include: unnecessary semi-colons at the end of statements, unescaped apostrophies in html text, unused variable, missing React import statements

### Lighthouse testing

Lighthouse testing revealed that button elements did not have id attributes which are required by assistive technologies. These were added to all buttons, with programatically generated unique values where required for components which are rendered multiple times.


### Accessability testing

Wave testing revealed contrast issues with buttons. The text colour for buttons in the primary and secondary colour was lightened, while outline buttons were changed from primary to a dark (or light for dark mode) colour, and the font size was increased for all buttons. This resolved the contrast issues.

Contrast issues were also detected between the dots on the calendar indicating where there are events for a given day. This was more difficult to address, because the calendar cells can have a number of different colours depending on their current state. After some experimentation, the `mix-blend-mode` attribute with a value of `difference` was used on these elements to invert their colour against that of the background. This means the colour of these indicators might not fit as well with the colour scheme of the site, but it guarantees there will be no contrast issues.

Three further contrast errors were found, but these were ignored as they apply to hidden elements which provide additional information for screen readers.

Wave testing also highlighted that avatar images throughout the website had the same text for the alt attribute. This was addressed by passing a `displayName` prop through to the Avatar component, and using this to generate an appropriate alt text value for each user.

The Wave validator also several form elements with no label on the profile update form and the event search form (caused by a missing or incorrect ids on input elements), and one element with a duplicate id on the contacts form (caused by a naming clash with another element on the add event form).
The label containing the notifications indicator was found to contain no text. This was rectified by putting a `<span>` element with the Tailwind CSS `sr-only` class inside the label, providing a read out of the number of notifications present for screen readers but visually hidden. This label was also flagged as orphaned from its form control by the Wave validator, however this was not fixed, as the label is used instead of a button for the DaisyUI dropdown component in order to overcome a bug with Safari.

Missing labels were found for the input elements which are part of the DaisyUI collapse components used to reveal further detail for each calendar event. This was rectified by passing the unique key value generated for each CalEvent instance as a `calEventId` prop, using this to generate a unique id for each input and associating a screen reader only label to each one.

The Wave report contained an alert about the `noscript` element. This was to flag that content within this element must be accessible. Since the element contains a simple text reminder that JavaScript must be enabled to use the website, this was deemed not to be an issue.

Wave flagged skipped heading levels in the notification items menu and on calendar events. The former was addressed by changing the `h3` elements used in the `NotificationItem` component to `h2` and styling to look like `h3`. The headings for event titles on calendar events were changed from `h4` to `h3`, which would appear to be correct as the next heading above them is an `h2`, however this did not resolve the validator error. `h2` and `h1` were also tested for these headings, but this still did not resolve the error. These elements were then changed to `p` and the error was resolved. The `h5` headings within the 'details' collapse component at the bottom of calendar events were also changed to `p` elements to resolve similar errors.

The wave report that the category icons on calendar events did not have unique text for the `alt` attribute. This was due to a bug rather than an oversight, and was corrected. Wave then flagged a 'redundant alternative text' alert, meaning that another nearby element had an image with the same `alt` text. This is because more than one event in the list of events had the 'shopping' category - given the purpose and meaning of the icon, a repeat occurence of the alt text is correct and was deemed not to be an issue.

### Resolved bugs
- During implementation of the `NotificationItem` component, requests to the REST API for the data for the events with which each notification is associated were frequently resulting in an HTTP 500 internal server error. A version of the API running on a development server was used for debugging. This revealed that the number of simultaneous requests for data coming from a large number of NotificationItems was overwhelming the free tier ElephantSQL database server. The fix was to add the full data for each event to the notification JSON served by the API, which meant that only one network request was required to fetch the notification and event data together. 
- During testing, a large amount of empty space was noted at the bottom of each page, but only for some user accounts. No elements causing this could be identified using the Chrome developer tools, and elements were manually removed from each component until the culprit was found. This revealed that the unordered list of norifications inside the DaisyUI dropdown component used for the notifications menu was taking up vertical space in the document even when closed/not visible. This was only noticeable for users with a large number of notifications and hence a very long list inside the menu. The issue was addressed by applying the Tailwind CSS hidden class to the unordered list when not visible. An event listener was added to detect clicks outside of the menu and close the list accordingly.

### Unresolved bugs

## Deployment

## Credits

### Code
- How to use the React Router `<BrowserRouter>` component to provide history context to `<Router>` components from [this Stack Overflow article](https://stackoverflow.com/questions/65425884/react-router-v6-error-useroutes-may-be-used-only-in-the-context-of-a-route)
- Technique to use an event handler to store the current size of the window in state variables in order to conditionally render components adapted from [this Stack Overflow question](https://stackoverflow.com/questions/62954765/how-to-do-conditional-rendering-according-to-screen-width-in-react)
- Code to handle current user context in `src/contexts/CurrentUserContext.js` adapted from Code Institute 'Moments' React walkthrough lessons
- Code to create and use axios interceptors to refresh tokens in `src/contexts/CurrentUserContext.js` and `src/utils/utils.js` adapted from Code Institute 'Moments' React walkthrough lessons
- The technique to add modal dialogs to the end of the body element in the DOM is from [upmostly.com](https://upmostly.com/tutorials/modal-components-react-custom-hooks)
- How to use the `:global` selector in CSS to ensure styles are overriden in a React component from [Stack Overflow](https://stackoverflow.com/questions/42191671/css-modules-reactjs-parent-and-child-css-classes-in-different-components)
- How to use `require` to ensure webpack processes local images is from [Stack Overflow](https://stackoverflow.com/questions/34582405/react-wont-load-local-images)
- How to use CSS filters to colour a SVG is from [Stack Overflow](https://stackoverflow.com/questions/22252472/how-can-i-change-the-color-of-an-svg-element)
- How to define a CSS class as part of a DaisyUI theme is from [GitHub](https://github.com/saadeghi/daisyui/discussions/640)
- How to iterate over they keys of a JavaScript object in React is from [Stack Overflow](https://stackoverflow.com/questions/40803828/how-can-i-map-through-an-object-in-reactjs)
- Technique for handling multiple selection elements in controlled React forms is from [Stack Overflow](https://stackoverflow.com/questions/50090335/how-handle-multiple-select-form-in-reactjs)
- How to correctly use the useCallback hook to declare a function outside of useEffect and call from inside useEffect to enable code reuse is from [Stack Overflow](https://stackoverflow.com/questions/56410369/can-i-call-separate-function-in-useeffect)
- How to add a number of minutes to a DateTime object is from [StackOverflow](https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object)
- Technique for using a timer to prevent excessive network requests when the values of input elements on a search form change is from the Code Institute Moments walkthrough project
- How to redirect to an appropriate page when the user enters an invalid URL using the Navigate component from React-Router-DOM has been adapted from [copycat.dev](https://www.copycat.dev/blog/react-router-redirect/)
- How to use Google Fonts in a Tailwind CSS project is from [daily-dev-tips.com](https://daily-dev-tips.com/posts/using-google-fonts-in-a-tailwind-project/)
- How to invert the colour of an element compared to its background is from [Stack Overflow](https://stackoverflow.com/questions/17741629/how-can-i-invert-color-using-css)
- How to create divs with diagonal lines is from [9elements.com](https://9elements.com/blog/pure-css-diagonal-layouts/)
- How to use the text-shadow CSS attribute to add an outline to text is from [Stack Overflow](https://stackoverflow.com/questions/57464935/font-outline-using-only-css)

The following documentation was referenced extensively throughout the project:

- [React Router Documentation](https://v5.reactrouter.com/)

### Media
- Placeholder screenshots image used on the wireframes by u_fg0tkeqgiy on [Pixabay](https://pixabay.com/vectors/view-web-secure-image-ipad-laptop-7321141/).
- Hero image used on the landing page by Pexels on [Pixabay](https://pixabay.com/photos/child-couple-daylight-family-1844901/).
- Placeholder avatar image used on the wireframes and in the app by Stephanie Edwards on [Pixabay](https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/).
- Fidget spinner image used for loading spinner by b0red on [Pixabay](https://pixabay.com/vectors/fidget-spinner-add-a-d-spin-2304681/)
- Images used for event category icons:
  - Club icon used for club by Clker-Free-Vector-Images on [Pixabay](https://pixabay.com/vectors/clubs-cards-club-shape-card-games-33561/)
  - Mortar board icon used for education Clker-Free-Vector-Images on [Pixabay](https://pixabay.com/vectors/graduation-cap-graduation-education-311979/)
  - Medical bag icon used for medical by OpenClipart-Vectors on [Pixabay](https://pixabay.com/vectors/red-cross-aide-assistance-158454/)
  - Musical note icon used for music by ruhbastard on [Pixabay](https://pixabay.com/vectors/music-note-music-note-musical-notes-1967480/)
  - Metallic O icon used for other by Clker-Free-Vector-Images on [Pixabay](https://pixabay.com/vectors/english-alphabets-o-letters-15th-33793/)
  - Shopping trolley icon used for shopping by Clker-Free-Vector-Images on [Pixabay](https://pixabay.com/vectors/shopping-cart-caddy-shopping-trolley-304843/)
  - Volley icon used for sport by Clker-Free-Vector-Images on [Pixabay](https://pixabay.com/vectors/volleyball-sport-black-white-306791/)
  - Aeroplane icon used for vacation by GDj on [Pixabay](https://pixabay.com/vectors/jumbo-jet-airplane-aeroplane-1801305/)
  - Office desk icon used for work by OpenClipart-Vectors on [Pixabay](https://pixabay.com/vectors/computer-office-worker-typing-146329/)
  - Present icon used for celebration by chachaoriginal on [Pixabay](https://pixabay.com/vectors/red-icon-present-gift-wrapped-1902863/)
  - Car icon used for outing by Clker-Free-Vector-Images on [Pixabay](https://pixabay.com/vectors/car-automobile-sedan-four-door-car-35502/)
  - Cat icon used for pets by Lohrelei on  [Pixabay](https://pixabay.com/vectors/cat-kitten-sitting-silhouette-1144200/)
- Fonts:
  [Google Fonts Fredoka One](https://fonts.google.com/?query=fredoka+one&sort=popularity)
  [Google Fonts Nunito](https://fonts.google.com/specimen/Nunito?query=nunito&sort=popularity)
  [Google Fonts Lato](https://fonts.google.com/?query=lato&sort=popularity)
