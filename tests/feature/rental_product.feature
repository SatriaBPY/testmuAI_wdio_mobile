Feature: Rental Products
  As a visitor
  I want to browse products available for rent
  So that I can find tools I can rent by the hour

  # AC1 – Rentals page accessible
  Scenario: Navigating to rentals page shows rental products list
    Given I navigate to the rentals page
    Then a list of all rental products is displayed

  # AC2 – Rental product display
  Scenario: Each rental product shows required information
    Given I am on the rentals page
    Then each rental product shows a product image, name, and price

  # AC3 – Rental detail page with duration slider
  #Scenario: Rental product detail shows duration slider instead of quantity buttons
  #  Given I am on the rentals page
  #  When I click on a rental product
  #  Then the product detail page shows a duration slider (1–10 hours) instead of plus/minus buttons
  #  And the total price is calculated as the hourly rate multiplied by the selected duration

  ## Edge cases for rental duration slider (BVA)
  Scenario: Detailed rental product shows 
    Given I am on the rentals page
    When I click on a rental product
    Then each rental product shows a product image, name, price, rental badge and description

    #Examples:
    #  | duration |
    #  | 1        |
    #  | 10       |

  #Scenario: Duration slider below minimum (0 hours) – edge
  #  Given I am on a rental product detail page
  #  When I try to set the duration slider to 0 hours
  #  Then the duration remains at 1 hour
  #  And the total price uses 1 hour

  #Scenario: Duration slider above maximum (11 hours) – edge
  #  Given I am on a rental product detail page
  #  When I try to set the duration slider to 11 hours
  #  Then the duration remains at 10 hours
  #  And the total price uses 10 hours

  # AC4 – Rental label in checkout
    @reset
  Scenario: Rental item is marked in checkout cart
    Given I have added a rental item to my cart
    When I go to the checkout cart
    Then the rental item is marked with "This is a rental item"

  ## Negative case: Non-rental item does not show rental label
  #Scenario: Non-rental item is not marked as rental in checkout
  #  Given I have added a non-rental (regular) item to my cart
  #  When I go to the checkout cart
  #  Then the item is not marked with "This is a rental item"