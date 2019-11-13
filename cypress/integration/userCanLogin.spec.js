describe('User can log in to application', () => {
  it('successfully', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: 'http://localhost:3000/auth/sign_in',
      response: 'fixture:successful_user_login.json',
      status: 200
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:3000/v1/trails',
      response: 'fixture:user_can_view_list_of_trails.json'
    })

    cy.visit('http://localhost:3001')
    cy.get('#navbar')
      .within(() => {
        cy.get('#nav-login').click()
      })
    cy.get('#login-form').within(() => {
      cy.get('#email-input').type('user@mail.com')
      cy.get('#password-input').type('password')
    })
    cy.get('#submit-login-form').click()
    cy.get('#welcome-message').should('contain', 'Hello name')
  })
})

describe('User can not log in to application', () => {
  beforeEach(function() {
  cy.server()
  cy.route({
    method: 'POST',
    url: 'http://localhost:3000/auth/sign_in',
    response: 'fixture:unsuccessful_user_login.json',
    status: 401
  })
  cy.route({
    method: 'GET',
    url: 'http://localhost:3000/v1/trails',
    response: 'fixture:user_can_view_list_of_trails.json'
  })
  cy.visit('http://localhost:3001'),
  cy.get('#navbar')
      .within(() => {
        cy.get('#nav-login').click()
      })
  })

  it('with wrong password', () => {
    cy.get('#login-form').within(() => {
      cy.get('#email-input').type('user@mail.com')
      cy.get('#password-input').type('wrongpassword')
    })
    cy.get('#submit-login-form').click()
    cy.get('#error-message').should('contain', 'Invalid login credentials. Please try again')
  })

  it('with wrong email', () => {
    cy.get('#login-form').within(() => {
      cy.get('#email-input').type('wrong@mail.com')
      cy.get('#password-input').type('password')
    })
    cy.get('#submit-login-form').click()
    cy.get('#error-message').should('contain', 'Invalid login credentials. Please try again')
  })
})