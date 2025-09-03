---
title: "Getting Started"
---

Welcome to ra-core, the headless foundation of react-admin! This documentation will guide you through building powerful admin applications using your preferred UI library.

![ra-core examples using various UI libraries](./img/ra-core-quick-start-guide-hero.png)

## What is ra-core?

Ra-core is the headless version of react-admin - it provides all the business logic, data management, and state handling without being tied to any specific UI library. While react-admin comes with a complete Material UI-based interface, ra-core gives you the freedom to build your admin interface with [Ant Design](https://ant.design/), [Chakra UI](https://chakra-ui.com/), [Daisy UI](https://daisyui.com/), [Shadcn UI](https://ui.shadcn.com/), or any custom UI components.

You can use ra-core to:
- **Create your own admin app** with your preferred design system
- **Build your own admin framework** by adding your own UI layer on top of ra-core's business logic

Throughout this documentation, we'll use the terms 'ra-core', 'react-admin headless', and 'react-admin' interchangeably when referring to concepts that apply to the headless core functionality.

## Why Choose ra-core?

Ra-core accelerates admin application development by providing:

- **UI Kit Agnostic**: Use any UI library or build your own components
- **Backend Agnostic**: Works with REST, GraphQL, RPC, SOAP, or any API
- **Rapid CRUD Development**: Build complete CRUD interfaces in minutes
- **Relationship Handling**: Effortlessly manage complex data relationships
- **Advanced Forms**: Built-in form state management and validation
- **Performance Optimizations**: Optimistic updates, intelligent caching, and React Query integration
- **Undoable Mutations**: Let users undo destructive actions
- **Access Control**: Built-in authentication and authorization
- **User Preferences**: Persistent storage for user settings
- **Internationalization**: Multi-language support out of the box
- **Type Safety**: Full TypeScript support
- **Long-term Sustainability**: Mature, well-maintained framework

For a complete feature overview, see our [Features Guide](./guides/Features.md).

## Installation

Install ra-core using npm or yarn:

```bash
npm install ra-core
# or
yarn add ra-core
```

### Quick Start Example

Here's a minimal admin app using ra-core with native HTML5 components:

First, install the JSON Server data provider for the example:

```bash
npm install ra-data-json-server
# or
yarn add ra-data-json-server
```

Then create your app:

```tsx
// in src/App.tsx
import React from 'react';
import { 
  CoreAdmin, 
  Resource, 
  ListBase, 
  useListContext, 
  ReferenceFieldBase, 
  useRecordContext 
} from 'ra-core';
import jsonServerProvider from 'ra-data-json-server';

// Simple TextField component to display user names
const UserNameField = () => {
    const record = useRecordContext();
    return <span>{record?.name}</span>;
};

// Simple HTML-based List component
const PostList = () => (
    <ListBase>
        <PostListView />
    </ListBase>
);

const PostListView = () => {
    const { data, isLoading } = useListContext();
    
    if (isLoading || !data) return <div>Loading...</div>;
    
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginBottom: '20px' }}>Posts</h1>
            <table style={{
                width: '100%', 
                borderCollapse: 'collapse',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <thead style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    <tr>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #ccc',
                            fontWeight: 'bold'
                        }}>ID</th>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #ccc',
                            fontWeight: 'bold'
                        }}>Title</th>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #ccc',
                            fontWeight: 'bold'
                        }}>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(record => (
                        <tr key={record.id}>
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
                                {record.id}
                            </td>
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
                                {record.title}
                            </td>
                            <td style={{ padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
                                <ReferenceFieldBase 
                                    source="userId" 
                                    reference="users"
                                    record={record}
                                >
                                    <UserNameField />
                                </ReferenceFieldBase>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
    <CoreAdmin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);

export default App;
```

Here is the result you should get:

![Ra-core quick start example](./img/ra-core-quick-start-example.png)

## Building Your UI Layer

Ra-core provides the foundation; you build the interface. Here's a suggested development path:

### Essential Components (Start Here)

1. **Admin Component**: Extend [`CoreAdmin`](./app-configuration/CoreAdmin.md) with your branding, global settings, and custom providers. Configure your data provider, auth provider, i18n provider, and global theme settings.

2. **Layout**: Create a layout component with navigation, header, and user menu. Your layout wraps all pages and typically includes a sidebar, top bar, breadcrumbs, and main content area. See the [Layout documentation](./app-configuration/CoreAdmin.md#layout) for implementation patterns.

3. **Navigation**: Build a sidebar or menu using `useResourceDefinitions` to list available resources and `useHasDashboard` to conditionally show a dashboard link. Create navigation items with proper routing and active states.

4. **List View**: Create list pages with titles and action buttons (like Create). Use [`ListBase`](./list/ListBase.md) as your foundation and build custom headers with search, filters, and bulk actions. See the [List Introduction](./list/ListTutorial.md) for step-by-step guidance.

5. **Data Table**: Build table components with filtering, sorting, and pagination. Leverage [`useListContext`](./list/useListContext.md) to access data and state. Implement column sorting, row selection, and responsive design. Consider creating reusable table components for different data types.

6. **Show View**: Design detail pages with navigation buttons using [`ShowBase`](./show/ShowBase.md). Create layouts that display record details clearly, with navigation to edit mode and related resources. Add action buttons for common operations.

7. **Field Components**: Create display components like `TextField`, `DateField`, `NumberField` using [`useFieldValue`](./fields/useFieldValue.md). Build specialized fields for different data types including email, URL, image, and rich text content. See the [Fields documentation](./fields/Fields.md) for comprehensive examples.

8. **Relational Fields**: Build `ReferenceField`, `ReferenceArrayField`, `ReferenceManyField` using their Base counterparts: [`ReferenceFieldBase`](./fields/ReferenceFieldBase.md), [`ReferenceArrayFieldBase`](./fields/ReferenceArrayFieldBase.md), and [`ReferenceManyFieldBase`](./fields/ReferenceManyFieldBase.md). These handle complex relationships and foreign key displays.

9. **Edit & Create Views**: Design form pages with navigation and actions using [`EditBase`](./create-edit/EditBase.md) and [`CreateBase`](./create-edit/CreateBase.md). Implement form layouts, validation feedback, and success/error handling. See the [Forms Guide](./guides/Forms.md) for comprehensive form building strategies.

10. **Input Components**: Create form inputs like `TextInput`, `DateInput`, `SelectInput` and `AutocompleteInput` using [`useInput`](./inputs/useInput.md). Build specialized inputs for different data types including rich text editors, file uploads, and date pickers. See the [Inputs documentation](./inputs/Inputs.md) for implementation patterns.

11. **Relational Inputs**: Build `ReferenceInput`, `ReferenceArrayInput` using their Base components: [`ReferenceInputBase`](./inputs/ReferenceInputBase.md) and [`ReferenceArrayInputBase`](./inputs/ReferenceArrayInputBase.md). These provide autocomplete functionality and relationship management in forms.

### Advanced Features (Go Further)

1. **Action Buttons**: Create `SaveButton` and `DeleteButton` components with loading states and custom side effects. Implement optimistic updates, confirmation dialogs, and custom success/error handlers. Use [`useCreate`](./data-fetching/useCreate.md), [`useUpdate`](./data-fetching/useUpdate.md), and [`useDelete`](./data-fetching/useDelete.md) hooks for data mutations.

2. **Bulk Actions**: Add toolbar for bulk operations on list selections. Implement batch delete, export, and custom bulk operations using [`useListContext`](./list/useListContext.md) for selection state and [`useUpdateMany`](./data-fetching/useUpdateMany.md) for batch operations.

3. **Notifications**: Implement toast notifications for errors and undo functionality using `useNotificationContext` and `useTakeUndoableMutation`. Create notification components that support different types (success, error, warning) and undoable actions.

4. **Authentication**: Design a [login page](./app-configuration/CoreAdmin.md#loginpage) and protected routes using the [Authentication system](./security/Authentication.md). Implement login forms, password reset, and protected page components using [`useLogin`](./security/useLogin.md), [`useLogout`](./security/useLogout.md), and [`Authenticated`](./security/Authenticated.md).

5. **Theme Switching**: Add dark/light mode toggles using [`useStore`](./preferences/useStore.md) for persistence. Create theme provider components and implement CSS variable switching or styled-components themes.

6. **Internationalization**: Create language switcher components using [`useLocaleState`](./i18n/useLocaleState.md) and [`useTranslate`](./i18n/useTranslate.md). Implement translation loading, locale switching, and RTL support. See the [Translation Guide](./guides/Translation.md) for complete i18n implementation.

7. **Error Handling**: Customize the [error page](./app-configuration/CoreAdmin.md#error). Implement global error boundaries and API error handling with user-friendly messages and recovery actions.

8. **Advanced Layouts**: Build tabbed forms, filter panels, breadcrumbs, and responsive designs. Create specialized layouts for different screen sizes, implement advanced form patterns like wizard flows, and enhance navigation with breadcrumbs.

## Real-World Examples

See ra-core in action with different UI libraries:

- **[React-Admin](https://marmelab.com/react-admin/)**: The complete Material UI implementation
- **[Shadcn Admin Kit](https://marmelab.com/shadcn-admin-kit/)**: A modern implementation using Shadcn UI
- **[Tutorial: React-Admin with Daisy UI](https://marmelab.com/blog/2023/11/28/using-react-admin-with-your-favorite-ui-library.html)**: Step-by-step guide using Tailwind CSS, Daisy UI, Tanstack Table, and React-Aria

## Documentation Structure

This documentation is organized to help you build effectively:

- **[Guides & Concepts](./guides/Architecture.md)**: Core concepts like architecture, data fetching, and security
- **[App Configuration](./app-configuration/CoreAdmin.md)**: Setting up CoreAdmin, resources, and routing
- **[Data Fetching](./data-fetching/DataProviders.md)**: Working with APIs, data providers, and queries
- **[Security](./security/Authentication.md)**: Authentication, authorization, and access control
- **[List Pages](./list/FilteringTutorial.md)**: Building list views, filtering, and pagination
- **[Creation & Edition](./create-edit/EditTutorial.md)**: Forms, validation, and input components
- **[Show Pages](./show/ShowBase.md)**: Detail views and field components
- **[Fields](./fields/Fields.md)**: Display components for different data types
- **[Inputs](./inputs/Inputs.md)**: Form input components and validation
- **[Internationalization](./i18n/TranslationSetup.md)**: Multi-language support and localization
- **[Common Components](./common/useGetRecordId.md)**: Shared utilities and patterns

## Next Steps

Ready to dive deeper? Start with the [General Concepts](./guides/Architecture.md) to understand ra-core's fundamental architecture, then explore the specific areas that match your development needs.

Happy building! 🚀