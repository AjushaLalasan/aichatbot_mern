import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../Components/Login';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Register from '../Components/Register';
import ErrorPage from '../Components/ErrorPage';
import DisplayRecipes from '../Foodie/DisplayRecipes';
import ManageRecipe from '../Chef/ManageRecipe';
import CreateRecipe from '../Chef/CreateRecipe';
 
jest.mock('axios');
 
describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  const renderLoginComponent = () => {
    return render(
      <Router>
        <Login />
      </Router>
    );
  };
 
 
  test('frontend_login_component_renders_the_with_login_heading', () => {
    renderLoginComponent();
 
 
    const loginHeadings = screen.getAllByText(/Login/i);
    expect(loginHeadings.length).toBeGreaterThan(0);
 
  });
 
 
  test('frontend_login_component_displays_validation_messages_when_login_button_is_clicked_with_empty_fields', async () => {
    renderLoginComponent();
 
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
 
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });
   
});
 
describe('Register Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  const renderRegisterComponent = () => {
    return render(
      <Router>
        <Register />
      </Router>
    );
  };
 
  test('frontend_register_component_renders_with_create_account_heading', () => {
    renderRegisterComponent();
 
    const createAccountHeading = screen.getByText('Register for Cookistry');
    expect(createAccountHeading).toBeInTheDocument();
  });
 
  test('frontend_register_component_displays_validation_messages_when_register_button_is_clicked_with_empty_fields', () => {
    renderRegisterComponent();
 
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
 
    expect(screen.getByText('First Name is required')).toBeInTheDocument();
    expect(screen.getByText('Last Name is required')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
  });
 
 
});
 
describe('ErrorPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderErrorComponent = () => {
    return render(
      <Router>
        <ErrorPage />
      </Router>
    );
  };
  test('frontend_errorpage_component_renders_with_error_heading', () => {
    renderErrorComponent();
    const headingElement = screen.getByText(/Something Went Wrong/i);
    expect(headingElement).toBeInTheDocument();
  });
 
  test('frontend_errorpage_component_renders_with_error_content', () => {
    renderErrorComponent();
    const paragraphElement = screen.getByText(/We're sorry, but an error occurred. Please try again later./i);
    expect(paragraphElement).toBeInTheDocument();
  });
});
 
describe('DisplayRecipes Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDisplayRecipesComponent = () => {
    return render(
      <Router>
        <DisplayRecipes />
      </Router>
    );
  };

  test('frontend_displayrecipes_component_renders_with_recipe_catalog_heading', () => {
    renderDisplayRecipesComponent();

    const headingElement = screen.getByRole('heading', { name: 'Recipe Catalog' });
    expect(headingElement).toBeInTheDocument();
  });

  test('frontend_displayrecipes_component_renders_logout_button', () => {
    renderDisplayRecipesComponent();

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('frontend_displayrecipes_component_renders_sort_dropdown', () => {
    renderDisplayRecipesComponent();

    const sortDropdown = screen.getByDisplayValue('Sort by Prep Time (ASC)');
    expect(sortDropdown).toBeInTheDocument();
  });

  test('frontend_displayrecipes_component_renders_table_headers', () => {
    renderDisplayRecipesComponent();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Prep Time (mins)')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('frontend_displayrecipes_component_shows_no_recipes_message_when_empty', () => {
    renderDisplayRecipesComponent();

    const noRecordsMessage = screen.getByText('No recipes found');
    expect(noRecordsMessage).toBeInTheDocument();
  });
});

// ManageRecipe Component Tests
describe('ManageRecipe Component', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === 'editId') return '';
        if (key === 'token') return 'mock-token';
        if (key === 'userData') return JSON.stringify({ userId: 'mock-user-id' });
        return null;
      }),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderManageRecipeComponent = () => {
    return render(
      <Router>
        <ManageRecipe />
      </Router>
    );
  };

  test('frontend_managerecipe_component_renders_with_manage_recipes_heading', () => {
    renderManageRecipeComponent();

    const headingElement = screen.getByRole('heading', { name: 'Manage Recipes' });
    expect(headingElement).toBeInTheDocument();
  });

  test('frontend_managerecipe_component_renders_navigation_buttons', () => {
    renderManageRecipeComponent();

    const addRecipeButton = screen.getByRole('button', { name: /Add Recipe/i });
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
   
    expect(addRecipeButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test('frontend_managerecipe_component_renders_category_filter_dropdown', () => {
    renderManageRecipeComponent();

    const categoryFilter = screen.getByDisplayValue('All Categories');
    expect(categoryFilter).toBeInTheDocument();
  });

  test('frontend_managerecipe_component_renders_table_headers', () => {
    renderManageRecipeComponent();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Prep Time')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('frontend_managerecipe_component_shows_no_recipes_message_when_empty', () => {
    renderManageRecipeComponent();

    const noRecordsMessage = screen.getByText('No recipes found');
    expect(noRecordsMessage).toBeInTheDocument();
  });
});

// CreateRecipe Component Tests
describe('CreateRecipe Component', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === 'editId') return '';
        if (key === 'token') return 'mock-token';
        if (key === 'userData') return JSON.stringify({ userId: 'mock-user-id' });
        return null;
      }),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderCreateRecipeComponent = (props = {}) => {
    return render(
      <Router>
        <CreateRecipe {...props} />
      </Router>
    );
  };

  test('frontend_createrecipe_component_renders_with_add_recipe_heading', () => {
    renderCreateRecipeComponent();

    const headingElement = screen.getByRole('heading', { name: 'Add Recipe' });
    expect(headingElement).toBeInTheDocument();
  });


  test('frontend_createrecipe_component_renders_all_form_fields', () => {
    renderCreateRecipeComponent();

    // Check for form labels
    expect(screen.getByText('Title:')).toBeInTheDocument();
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
    expect(screen.getByText('Prep Time (minutes):')).toBeInTheDocument();
    expect(screen.getByText('Cook Time (minutes):')).toBeInTheDocument();
    expect(screen.getByText('Servings:')).toBeInTheDocument();
    expect(screen.getByText('Cuisine:')).toBeInTheDocument();
    expect(screen.getByText('Ingredients (comma-separated):')).toBeInTheDocument();
    expect(screen.getByText('Instructions (comma-separated):')).toBeInTheDocument();
    expect(screen.getByText('Tags (comma-separated):')).toBeInTheDocument();
    expect(screen.getByText('Notes:')).toBeInTheDocument();
  });

  test('frontend_createrecipe_component_renders_submit_button', () => {
    renderCreateRecipeComponent();

    const submitButton = screen.getByRole('button', { name: /Add Recipe/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('frontend_createrecipe_component_displays_validation_errors_on_empty_submit', () => {
    renderCreateRecipeComponent();

    const submitButton = screen.getByRole('button', { name: /Add Recipe|Update Recipe/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Difficulty is required')).toBeInTheDocument();
    expect(screen.getByText('Prep time must be at least 1 minute')).toBeInTheDocument();
    expect(screen.getByText('Cook time must be at least 1 minute')).toBeInTheDocument();
    expect(screen.getByText('Servings must be at least 1')).toBeInTheDocument();
    expect(screen.getByText('At least one ingredient is required')).toBeInTheDocument();
    expect(screen.getByText('At least one instruction is required')).toBeInTheDocument();
  });


});