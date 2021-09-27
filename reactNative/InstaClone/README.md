# InstaClone

Almost identical clone of the popular social network "Instagram".

## Setup Instructions

Install the app through the [apk](https://www.dropbox.com/s/bgy75m8bd4q7czq/app-release.apk?dl=0).
Or
Connect your device with usb debugging enabled and run `npm run android`.


## Features
1) Upload,View Posts (image only, image+video, video only)
2) Upload,View Stories (image only, image+video, video only)
3) Upload,View Reels (video only)
4) Comment, Like Posts. Like Reels.
5) Search for user, Follow/Unfollow users.
6) Authentication (Signup, Login, Forgot Password)
7) Fluid Navigation between screens
8) Add content through gallery/camera.
9) Miscl Informational Modals.

## Bugs As Of Now
1) Android auto denying Storage, Audio Permissions when installing through apk (even though AndroidManifest.xml, app.json is properly setup to allow the permissions)
2) Camera black screen on first mount.
3) Data Fetching is slow as the server is located in the US region of the free tier of firebase.
