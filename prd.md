**Problem**: I lose focus on intentional skill practice during high-stress Overwatch matches
**Goal**: A tool that periodically "pokes" user to stay intentional
**Success Metric**: "Percent of games where post-game rating was 4-5 / 5?"

# Milestones

## V0.1: The Core Loop
* [x] Basic React UI with customizable timer
* [x] Hook up web speech API for one voice
* [x] Play custom TTS on timer expiration

## V0.2: Skills 1.0
* [x] Be able to store multiple skills
  * [x] Each skill contains description, TTS text, timer (and eventually progress data)
* [x] Skill presets with common skills

## V0.3: Local Storage
* [x] Store skills in local storage
* [x] Add functionality to reset skills to default

## V1.0: Data > Private
* [ ] Login system to store skills and progress data
* [ ] Authentication
* [ ] Database

## V1.1: Skills Browser
* [ ] NavBar with Home page and a new Skills Browser page
* [ ] Skills Browser page
  * [ ] Browse a list of skills, which you can add to your own list

## V1.2: Ratings
* [ ] Post-game "rating" system
  * [ ] Ratings and number of games tracked per skill
* [ ] Store rating data and display in skill page / overlay

## V1.3: Skills 2.0
* [ ] Sort and filter skills
* [ ] Hero-specific skills and other categorization

## V1.4: UGC
* [ ] Find skills that others make
* [ ] User-created guides with skills lists and blog-style writing
* [ ] Workout programs
