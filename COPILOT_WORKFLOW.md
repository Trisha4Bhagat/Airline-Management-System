# Copilot Workflow Instructions

For every task I give you, follow this process:

## 1. Session Documentation
- Log the session in `AI_ASSISTANT_LOG.md`
- Use this format:
  - **Task**: Clear description of what was accomplished
  - **Prompts used**: List of key prompts/questions that guided the session
  - **Code/changes generated**: Summary of code or content created
  - **Modifications Made**: How the generated code was adapted or customized
  - **Outcome**: Results achieved (success/fail/partial)
  - **Screenshots/Recording**: Placeholders for visual documentation
  - **Next steps**: Future tasks and improvements

## 2. Troubleshooting
- If any error, bug, or unexpected output happens:
  - Record it in `TROUBLESHOOTING_LOG.md`
  - Include:
    - Error message (exact text)
    - Root cause (if found)
    - Fix applied (code or configuration changes)
    - Verification result (how we checked it worked)

## 3. Effectiveness Report
- Update `AI_EFFECTIVENESS_REPORT.md`
- Include for each session:
  - **Productivity impact**: Time saved/lost (estimated hours)
  - **Efficiency gain**: Percentage improvement over manual coding
  - **Task automation**: What repetitive tasks were automated
  - **Code quality assessment**: Structure improvements, best practices, issue prevention
  - **Learning points**: New knowledge, better understanding, helpful resources

## 4. Commit & Push
- Suggest a commit message following this format:
  `<type>: <short description> (AI-assisted with Copilot)`
  
  Types:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `style`: Formatting, missing semicolons, etc.
  - `refactor`: Code restructuring
  - `test`: Adding tests
  - `chore`: Maintenance tasks
  
- Stage, commit, and push updated logs and code.

## 5. Move to Next Task
- Once finished, wait for me to assign the next session.

## Example Commit Messages
```
docs: Add troubleshooting log for backend null byte error (AI-assisted with Copilot)

fix: Resolve flight API GET request bug (AI-assisted with Copilot)

feat: Implement admin CRUD UI for flights (AI-assisted with Copilot)
```