const electron = require('electron');
const app = electron.app;
const path = require('path');
const os = require('os');
const ElectronPreferences = require('electron-preferences');

const preferences = new ElectronPreferences({
    /**
     * Where should preferences be saved?
     */
    'dataStore': path.resolve(app.getPath('userData'), 'preferences.json'),
    /**
     * Default values.
     */
    'defaults': {
        'notes': {
            'folder': path.resolve(os.homedir(), 'Notes')
        },
        'markdown': {
            'auto_format_links': true,
            'show_gutter': false
        },
        'preview': {
            'show': true
        },
        'drawer': {
            'show': true
        }
    },
    /**
     * If the `onLoad` method is specified, this function will be called immediately after
     * preferences are loaded for the first time. The return value of this method will be stored as the
     * preferences object.
     */
    'onLoad': (preferences) => {
        // ...
        return preferences;
    },
    /**
     * The preferences window is divided into sections. Each section has a label, an icon, and one or
     * more fields associated with it. Each section should also be given a unique ID.
     */
    'sections': [
        {
            'id': 'about',
            'label': 'About You',
            /**
             * See the list of available icons below.
             */
            'icon': 'single-01',
            'form': {
                'groups': [
                    {
                        /**
                         * Group heading is optional.
                         */
                        'label': 'About You',
                        'fields': [
                            {
                                'label': 'Host',
                                'key': 'host',
                                'type': 'text',
                                /**
                                 * Optional text to be displayed beneath the field.
                                 */
                                // 'help': 'What is your first name?'
                            },
                            {
                                'label': 'Port',
                                'key': 'port',
                                'type': 'text',
                            },
                            {
                                'label': 'User',
                                'key': 'user',
                                'type': 'text',
                            },
                            {
                                'label': 'Password',
                                'key': 'password',
                                'type': 'text',
                            },
                        ]
                    }
                ]
            }
        },
        {
            'id': 'space',
            'label': 'Volumes Settings',
            'icon': 'layers-3',
            'form': {
                'groups': [
                    {
                        'label': 'Volumes Settings',
                        'fields': [
                            {
                                'label': 'Phone Number',
                                'key': 'phone_number',
                                'type': 'text',
                                'help': 'What is your phone number?'
                            },
                        ]
                    }
                ]
            }
        }
    ]
});

module.exports = preferences;