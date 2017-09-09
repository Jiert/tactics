# Square

  Let's talk about a square. It should:

  * Have as little information about overall state as possible
  * Only concern itself with it's own data

  A square needs to be able to:

  * Show a unit
    - Now we'll have a unit id, and we'll use a selector to get it out of state
      in mapStateToProps
  * Show a highlight for when it's in range of a moving unit
    - This will be it's own component (see below)
  * Hold a highlight prop in state to send to the highlight component
  * Show Fog of War when a unit isn't near
  * Show an attack range highlight
  * Handle clicks
    * Move a unit to the square
    * Clear attack and move mode if no unit on square


# Highlight

  A highlight needs to simply display a color based on props

  * move mode and in range of the moving unit: light green
  * move mode and in range of the moving unit and hovered: dark green
  * attack mode and in range of attacking unit: light red
  * attack mode and in range of attack unit, attacked unit, and move hover: dark red



# Note:
  
  Keep in mind that we can capture clicks through all these elements
  So we can make the highlight do whatever we need and not swallow


  <Square>
    <Unit />
    <Highlight />
    <Fog /> <-- fog should swallow clicks 
  </Square>


# Move Mode

  So a player has an active unit and clicks "Move". We turn on move mode, which could run a function that finds all the squares that are in range, and sets each square that is in Range to "inRange" or something. That way we're not asking every square (or highlight) to run a function everytime the damn move mode is clicked.


  * Unit at 5.5 says they want to move
  * Run a function that takes the unit's movesLeft and finds all the squares that need to highlight.
  * Set the 'highlighted' state of each square in redux
  * A square can only receive a unit if it's highlighted, and a unit can only be attacked if it's highlighted for attack.
