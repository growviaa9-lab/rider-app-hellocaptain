module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android',
          packageImportPath: 'import com.oblador.vectoricons.VectorIconsPackage;',
          packageInstance: 'new VectorIconsPackage()'
        }
      }
    },
    'react-native-image-picker': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-image-picker/android',
          packageImportPath: 'import com.imagepicker.ImagePickerPackage;',
          packageInstance: 'new ImagePickerPackage()'
        }
      }
    }
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts']
};

