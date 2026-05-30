Feature: Product Overview with Pagination, Search, Filtering, and Sorting
  As a visitor
  I want to browse a paginated overview of all products with search, filtering, and sorting
  So that I can efficiently find products of interest

  Background:
    Given I am on the home page

  # AC1 – Product grid and list display
  Scenario: Product list is displayed with correct information
    Then a list of product cards is displayed
    And each card shows a product image, name, and price

  Scenario: Product grid is displayed with correct information
    Then a grid of product cards is displayed
    And each card shows a product image, name, and price

   # AC2 – Navigate to product detail
   Scenario: Clicking a product card navigates to detail page
     When I click on a product card
     Then I am navigated to the product detail page

  # # AC4 – Search (with BVA)
   Scenario: Valid search query with minimum length (3 characters)
     When I enter a search query "Com" and submit
     Then the product grid updates to show only matching products
     #And all active filters are reset

   Scenario: Valid search query with maximum length (40 characters)
     When I enter a search query with exactly 40 characters and submit
     Then system shows "No products found" message

   Scenario: Search query with less than 3 characters (invalid - below BVA min)
     When I enter a search query "Co" and submit
     Then the product grid updates to show only matching products

   Scenario: Search query with more than 40 characters (invalid - above BVA max)
     When I enter a search query with 41 characters and submit
     Then system shows "No products found" message

   Scenario: Search query with special characters (edge)
     When I enter a search query "@#$%^&" and submit
     Then system shows "No products found" message

   Scenario: Search query with spaces only (negative)
     When I enter a search query "   " and submit
     Then system shows "No products found" message

   # AC5 – Category filter
   Scenario: Selecting a single category filter
     Given I check one category checkbox in the sidebar
     Then the product grid updates to show only products from that category

   Scenario: Selecting multiple category filters
     Given I check multiple category checkboxes in the sidebar
     Then the product grid updates to show only products from those selected categories

 
   # AC6 – Brand filter
     @reset
   Scenario: Selecting a single brand filter
     Given I check one brand checkbox in the sidebar
     Then the product grid updates to show only products from that brand

   Scenario: Selecting multiple brand filters
     Given I check multiple brand checkboxes in the sidebar
     Then the product grid updates to show only products from those selected brands

   # AC7 – Sorting
     @reset
   Scenario Outline: Sorting products by different options
     Given I select sort option "<sort_option>"
     Then the product grid reloads with products ordered by "<sort_option>"

     Examples:
       | sort_option      |
       | Name (A-Z)       |
       | Name (Z-A)       |
       | Price (High-Low) |
       | Price (Low-High) |