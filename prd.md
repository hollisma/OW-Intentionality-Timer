**Problem**: I lose focus on intentional skill practice during high-stress Overwatch matches
**Goal**: A tool that periodically "pokes" user to stay intentional
**Success Metric**: "Percent of games where post-game rating was 4-5 / 5?"

# Milestones

## M1: The Core Loop (v0.1)
* Basic React UI with customizable timer
* Hook up web speech API for one voice
* Play custom TTS on timer expiration

## M2: Skills 1.0 (v0.2)
* Be able to store multiple skills
  * Each skill contains description, TTS text, timer (and eventually progress data)
* Skill presets with common skills

## M3: Data > Local (v0.9)
* Post-game "rating" system
  * Ratings and number of games tracked per skill
* Store rating data and display in skill page / overlay

## M3: Data > Private (v1.0)
* Login system to store skills and progress data
* Authentication
* Database

## M4: Skills 2.0 (v1.1)
* Sort and filter skills
* Hero-specific skills and other categorization

## M5: UGC (v1.2)
* Find skills that others make
* User-created guides with skills lists and blog-style writing
* Workout programs
