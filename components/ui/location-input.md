# LocationInput Component

A reusable React component that provides Google Maps autocomplete functionality
for location lookup services.

## Features

- **Google Maps Autocomplete**: Real-time location suggestions as you type
- **Keyboard Navigation**: Use arrow keys to navigate through suggestions
- **Debounced Search**: Configurable debounce to prevent excessive API calls
- **Loading States**: Visual loading indicator during API requests
- **Accessible**: Full keyboard support and ARIA-compliant
- **Customizable**: Styling and behavior can be customized via props
- **TypeScript Support**: Full type safety with TypeScript definitions

## Prerequisites

1. **Google Maps API Key**: You need a valid Google Maps API key with the Places
   API enabled
2. **API Key Setup**: Enable the following APIs in your Google Cloud Console:
   - Places API
   - Maps JavaScript API

## Installation

The component is already included in your project at
`src/components/ui/location-input.tsx`.

## Usage

### Basic Usage

```tsx
import {
  LocationInput,
  LocationSuggestion,
} from "./components/ui/location-input";

function MyComponent() {
  const handleLocationSelect = (location: LocationSuggestion) => {
    console.log("Selected location:", location);
  };

  return (
    <LocationInput
      apiKey="YOUR_GOOGLE_MAPS_API_KEY"
      onLocationSelect={handleLocationSelect}
      placeholder="Search for a location..."
    />
  );
}
```

### Advanced Usage

```tsx
import {
  LocationInput,
  LocationSuggestion,
} from "./components/ui/location-input";

function MyComponent() {
  const [selectedLocation, setSelectedLocation] = useState<
    LocationSuggestion | null
  >(null);

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    // You can now use the location data for your application
    console.log("Place ID:", location.place_id);
    console.log("Description:", location.description);
  };

  const handleInputChange = (value: string) => {
    // Handle input changes (e.g., for form validation)
    console.log("Input value:", value);
  };

  return (
    <LocationInput
      apiKey="YOUR_GOOGLE_MAPS_API_KEY"
      onLocationSelect={handleLocationSelect}
      onInputChange={handleInputChange}
      placeholder="Enter your location..."
      debounceMs={500} // Custom debounce time
      className="w-full max-w-md"
      suggestionsClassName="custom-suggestions"
    />
  );
}
```

## Props

### LocationInputProps

| Prop                   | Type                                     | Default                      | Description                              |
| ---------------------- | ---------------------------------------- | ---------------------------- | ---------------------------------------- |
| `apiKey`               | `string`                                 | -                            | **Required**. Your Google Maps API key   |
| `onLocationSelect`     | `(location: LocationSuggestion) => void` | -                            | Callback when a location is selected     |
| `onInputChange`        | `(value: string) => void`                | -                            | Callback when input value changes        |
| `placeholder`          | `string`                                 | `"Search for a location..."` | Input placeholder text                   |
| `className`            | `string`                                 | -                            | CSS classes for the input container      |
| `suggestionsClassName` | `string`                                 | -                            | CSS classes for the suggestions dropdown |
| `debounceMs`           | `number`                                 | `300`                        | Debounce time in milliseconds            |
| `...props`             | `HTMLInputElement`                       | -                            | All standard HTML input props            |

### LocationSuggestion Interface

```typescript
interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
```

## Keyboard Navigation

- **Arrow Down**: Navigate to next suggestion
- **Arrow Up**: Navigate to previous suggestion
- **Enter**: Select the currently highlighted suggestion
- **Escape**: Close the suggestions dropdown

## Styling

The component uses Tailwind CSS classes and follows your existing design system.
You can customize the appearance by:

1. **Container Styling**: Use the `className` prop to style the input container
2. **Suggestions Styling**: Use the `suggestionsClassName` prop to style the
   dropdown
3. **CSS Customization**: Override the default classes in your CSS

## API Key Security

**Important**: Never expose your API key in client-side code for production
applications. Consider:

1. **Environment Variables**: Store the API key in environment variables
2. **Backend Proxy**: Create a backend endpoint that proxies requests to Google
   Maps API
3. **API Key Restrictions**: Set up proper restrictions in Google Cloud Console

### Environment Variable Example

```tsx
<LocationInput
  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
  onLocationSelect={handleLocationSelect}
/>;
```

## Error Handling

The component includes built-in error handling for:

- Network errors
- API quota exceeded
- Invalid API key
- No results found

Errors are logged to the console and the suggestions list will be empty.

## Performance Considerations

- **Debouncing**: Default 300ms debounce prevents excessive API calls
- **Lazy Loading**: Google Maps API is only loaded when needed
- **Memory Management**: Proper cleanup of timeouts and event listeners

## Browser Support

- Modern browsers with ES6+ support
- Requires internet connection for Google Maps API

## Troubleshooting

### Common Issues

1. **No suggestions appearing**: Check your API key and ensure Places API is
   enabled
2. **CORS errors**: Ensure your API key has proper domain restrictions
3. **Quota exceeded**: Check your Google Cloud Console for usage limits

### Debug Mode

Enable browser developer tools to see detailed error messages and API responses.

## Example Implementation

See `src/components/LocationInputExample.tsx` for a complete working example.
