Feature: Product Detail Page
  As a visitor
  I want to view a product's details, add it to my cart, or save it to my favorites
  So that I can purchase it or come back to it later

  Background:
    Given I am on the product detail page for a product that is in stock

  #AC1 – Product information shown
  Scenario: All product information is displayed correctly
    Then the product image, name, description, price, category badge, and brand badge are shown

  #AC2 – Quantity selector for in-stock product
  Scenario: Quantity selector is displayed with default value
    Then a quantity input field is displayed with plus (+) and minus (-) buttons
    And the default quantity is 1

  #AC3 – Increase quantity
  Scenario: Clicking plus button increases quantity by 1
    When I click the plus button
    Then the quantity increases by 1

  #AC4 – Decrease quantity
  Scenario: Clicking minus button decreases quantity by 1 when quantity > 1
    Given the quantity is 5
    When I click the minus button
    Then the quantity decreases to 4

  # AC5 – Minimum quantity (edge)
  Scenario: Clicking minus button when quantity is 1 does not decrease further
    Given the quantity is 1
    When I click the minus button
    Then the quantity remains at 1

  

  # AC7 – Add to cart
  Scenario: Add to cart with valid quantity shows success message
    Given a valid quantity (e.g., 3) is selected
    When I click the "Add to Cart" button
    Then the product is added to the cart with quantity 3
    #And cart quantity icon shows "3"

 