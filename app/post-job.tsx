import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface JobFormData {
  // Step 1: Service Type
  serviceType: string;
  
  // Step 2: Property Details
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: string;
  
  // Step 3: Location
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Step 4: Service Details
  urgency: 'regular' | 'urgent' | 'emergency';
  recurrence: 'once' | 'weekly' | 'bi-weekly' | 'monthly';
  
  // Step 5: Schedule
  preferredDate: string;
  preferredTime: string;
  
  // Step 6: Additional Details
  title: string;
  additionalInstructions: string;
  supplies: 'customer' | 'cleaner' | 'both';
  
  // Step 7: Budget
  budgetType: 'fixed' | 'hourly';
  budgetAmount: string;
  
  // Step 8: Photos & Review
  photos: string[];
}

const initialFormData: JobFormData = {
  serviceType: '',
  propertyType: '',
  bedrooms: 1,
  bathrooms: 1,
  squareFootage: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  urgency: 'regular',
  recurrence: 'once',
  preferredDate: '',
  preferredTime: '',
  title: '',
  additionalInstructions: '',
  supplies: 'cleaner',
  budgetType: 'fixed',
  budgetAmount: '',
  photos: []
};

const serviceTypes = [
  { id: 'regular', name: 'Regular Cleaning', description: 'Standard house/apartment cleaning' },
  { id: 'deep', name: 'Deep Cleaning', description: 'Thorough, detailed cleaning service' },
  { id: 'move-in', name: 'Move-in Cleaning', description: 'Cleaning before moving into new place' },
  { id: 'move-out', name: 'Move-out Cleaning', description: 'Cleaning when moving out' },
  { id: 'post-construction', name: 'Post-Construction', description: 'Cleanup after renovation/construction' },
  { id: 'office', name: 'Office Cleaning', description: 'Commercial office space cleaning' },
  { id: 'other', name: 'Other', description: 'Custom cleaning service' }
];

const propertyTypes = [
  { id: 'apartment', name: 'Apartment' },
  { id: 'house', name: 'House' },
  { id: 'condo', name: 'Condo' },
  { id: 'townhouse', name: 'Townhouse' },
  { id: 'office', name: 'Office' },
  { id: 'other', name: 'Other' }
];

export default function PostJobScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  const totalSteps = 9;

  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Auto-generate job title based on service type and property details
  const generateJobTitle = () => {
    const serviceType = serviceTypes.find(s => s.id === formData.serviceType);
    const propertyType = propertyTypes.find(p => p.id === formData.propertyType);
    
    if (!serviceType || !propertyType) return '';
    
    let title = serviceType.name;
    
    // Add property details if available
    if (formData.bedrooms > 0 && formData.bathrooms > 0 && propertyType.name !== 'Office') {
      title += ` - ${formData.bedrooms}BR ${formData.bathrooms}Bath ${propertyType.name}`;
    } else {
      title += ` - ${propertyType.name}`;
    }
    
    return title;
  };

  // Get example text for special instructions based on service type
  const getInstructionsExample = () => {
    const examples = {
      'regular': 'Focus on kitchen and bathrooms. We have two cats, please use pet-friendly products. Vacuum all carpets and mop hard floors.',
      'deep': 'Deep clean kitchen appliances (inside oven, fridge, microwave). Clean baseboards, light fixtures, and inside cabinets. Pay special attention to bathrooms.',
      'move-in': 'Property is empty but needs thorough cleaning before we move in. Clean all surfaces, inside cabinets/drawers, and sanitize bathrooms.',
      'move-out': 'Need cleaning for security deposit return. Clean inside oven, fridge, all surfaces. Property should be spotless for inspection.',
      'post-construction': 'Remove all dust from renovation work. Clean windows, wipe down all surfaces, vacuum/mop thoroughly. Some paint residue may need attention.',
      'office': 'Clean 5 desks, conference room, kitchenette. Empty trash, vacuum carpets, sanitize surfaces. Building access code: 1234.',
      'other': 'Please describe your specific cleaning needs, any areas that require special attention, and any supplies or access information.'
    };
    
    return examples[formData.serviceType as keyof typeof examples] || examples.other;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
      // Auto-populate job title when reaching step 6 if it's empty
      if (currentStep === 5 && !formData.title && formData.serviceType && formData.propertyType) {
        const autoTitle = generateJobTitle();
        if (autoTitle) {
          updateFormData({ title: autoTitle });
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Post Job',
      'Are you ready to post this job and receive offers from cleaners?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Post Job', 
          onPress: () => {
            // TODO: Submit to backend
            console.log('Job posted:', formData);
            Alert.alert('Success!', 'Your job has been posted successfully.', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  // Photo upload functions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map(asset => asset.uri);
      updateFormData({ 
        photos: [...formData.photos, ...newPhotos].slice(0, 6) // Max 6 photos
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhoto = result.assets[0].uri;
      updateFormData({ 
        photos: [...formData.photos, newPhoto].slice(0, 6) // Max 6 photos
      });
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImageFromGallery },
      ]
    );
  };

  const StepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View key={i} style={styles.stepIndicatorContainer}>
          <View style={[
            styles.stepDot,
            {
              backgroundColor: i + 1 <= currentStep ? colors.tint : colors.background,
              borderColor: colors.tint
            }
          ]}>
            {i + 1 < currentStep ? (
              <Ionicons name="checkmark" size={12} color="white" />
            ) : (
              <Text style={[
                styles.stepNumber,
                { color: i + 1 <= currentStep ? 'white' : colors.tint }
              ]}>
                {i + 1}
              </Text>
            )}
          </View>
          {i < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              { backgroundColor: i + 1 < currentStep ? colors.tint : colors.background }
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const SelectionButton = ({ 
    title, 
    description, 
    isSelected, 
    onPress 
  }: {
    title: string;
    description?: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.selectionButton,
        {
          backgroundColor: colors.background,
          borderColor: isSelected ? colors.tint : colors.background,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.selectionContent}>
        <Text style={[styles.selectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.selectionDescription, { color: colors.icon }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={[
        styles.radioButton,
        {
          borderColor: isSelected ? colors.tint : colors.icon,
          backgroundColor: isSelected ? colors.tint : 'transparent'
        }
      ]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  const NumberSelector = ({ 
    label, 
    value, 
    onIncrease, 
    onDecrease 
  }: {
    label: string;
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }) => (
    <View style={styles.numberSelector}>
      <Text style={[styles.numberLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.numberControls}>
        <TouchableOpacity
          style={[styles.numberButton, { backgroundColor: colors.background }]}
          onPress={onDecrease}
          disabled={value <= 1}
        >
          <Ionicons name="remove" size={20} color={value <= 1 ? colors.icon : colors.tint} />
        </TouchableOpacity>
        <Text style={[styles.numberValue, { color: colors.text }]}>{value}</Text>
        <TouchableOpacity
          style={[styles.numberButton, { backgroundColor: colors.background }]}
          onPress={onIncrease}
        >
          <Ionicons name="add" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              What type of cleaning do you need?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Select the service that best matches your needs
            </Text>
            <View style={styles.optionsContainer}>
              {serviceTypes.map((service) => (
                <SelectionButton
                  key={service.id}
                  title={service.name}
                  description={service.description}
                  isSelected={formData.serviceType === service.id}
                  onPress={() => updateFormData({ serviceType: service.id })}
                />
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Tell us about your property
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              This helps cleaners prepare and provide accurate quotes
            </Text>
            
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Type</Text>
              <View style={styles.propertyTypeGrid}>
                {propertyTypes.map((type) => (
                  <SelectionButton
                    key={type.id}
                    title={type.name}
                    isSelected={formData.propertyType === type.id}
                    onPress={() => updateFormData({ propertyType: type.id })}
                  />
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Size Details</Text>
              <View style={styles.numberSelectorsContainer}>
                <NumberSelector
                  label="Bedrooms"
                  value={formData.bedrooms}
                  onIncrease={() => updateFormData({ bedrooms: formData.bedrooms + 1 })}
                  onDecrease={() => updateFormData({ bedrooms: Math.max(1, formData.bedrooms - 1) })}
                />
                <NumberSelector
                  label="Bathrooms"
                  value={formData.bathrooms}
                  onIncrease={() => updateFormData({ bathrooms: formData.bathrooms + 1 })}
                  onDecrease={() => updateFormData({ bathrooms: Math.max(1, formData.bathrooms - 1) })}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Square Footage (optional)
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder="e.g., 1200"
                  placeholderTextColor={colors.icon}
                  value={formData.squareFootage}
                  onChangeText={(text) => updateFormData({ squareFootage: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Where is the cleaning location?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              We'll use this to match you with nearby cleaners
            </Text>
            
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Street Address *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder="123 Main Street"
                  placeholderTextColor={colors.icon}
                  value={formData.address}
                  onChangeText={(text) => updateFormData({ address: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Apartment/Unit (optional)
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder="Apt 4B"
                  placeholderTextColor={colors.icon}
                  value={formData.apartment}
                  onChangeText={(text) => updateFormData({ apartment: text })}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, { flex: 2 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>City *</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: colors.background, 
                      color: colors.text,
                      borderColor: colors.background 
                    }]}
                    placeholder="New York"
                    placeholderTextColor={colors.icon}
                    value={formData.city}
                    onChangeText={(text) => updateFormData({ city: text })}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>State *</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: colors.background, 
                      color: colors.text,
                      borderColor: colors.background 
                    }]}
                    placeholder="NY"
                    placeholderTextColor={colors.icon}
                    value={formData.state}
                    onChangeText={(text) => updateFormData({ state: text })}
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>ZIP *</Text>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: colors.background, 
                      color: colors.text,
                      borderColor: colors.background 
                    }]}
                    placeholder="10001"
                    placeholderTextColor={colors.icon}
                    value={formData.zipCode}
                    onChangeText={(text) => updateFormData({ zipCode: text })}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Service preferences
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Let us know your timing and frequency needs
            </Text>
            
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>How urgent is this?</Text>
              <SelectionButton
                title="Regular"
                description="Standard scheduling (2-7 days)"
                isSelected={formData.urgency === 'regular'}
                onPress={() => updateFormData({ urgency: 'regular' })}
              />
              <SelectionButton
                title="Urgent"
                description="Need it done within 24-48 hours"
                isSelected={formData.urgency === 'urgent'}
                onPress={() => updateFormData({ urgency: 'urgent' })}
              />
              <SelectionButton
                title="Emergency"
                description="Need it done today/ASAP"
                isSelected={formData.urgency === 'emergency'}
                onPress={() => updateFormData({ urgency: 'emergency' })}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>How often?</Text>
              <SelectionButton
                title="One-time"
                description="Just this once"
                isSelected={formData.recurrence === 'once'}
                onPress={() => updateFormData({ recurrence: 'once' })}
              />
              <SelectionButton
                title="Weekly"
                description="Every week"
                isSelected={formData.recurrence === 'weekly'}
                onPress={() => updateFormData({ recurrence: 'weekly' })}
              />
              <SelectionButton
                title="Bi-weekly"
                description="Every 2 weeks"
                isSelected={formData.recurrence === 'bi-weekly'}
                onPress={() => updateFormData({ recurrence: 'bi-weekly' })}
              />
              <SelectionButton
                title="Monthly"
                description="Once a month"
                isSelected={formData.recurrence === 'monthly'}
                onPress={() => updateFormData({ recurrence: 'monthly' })}
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              When would you like the cleaning?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Choose your preferred date and time
            </Text>
            
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Preferred Date *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={colors.icon}
                  value={formData.preferredDate}
                  onChangeText={(text) => updateFormData({ preferredDate: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Preferred Time *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder="e.g., 10:00 AM or Morning"
                  placeholderTextColor={colors.icon}
                  value={formData.preferredTime}
                  onChangeText={(text) => updateFormData({ preferredTime: text })}
                />
              </View>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Additional details
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Help cleaners understand your specific needs
            </Text>
            
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Job Title *</Text>
                <View style={styles.titleInputContainer}>
                  <TextInput
                    style={[styles.textInput, { 
                      backgroundColor: colors.background, 
                      color: colors.text,
                      borderColor: colors.background,
                      flex: 1
                    }]}
                    placeholder="e.g., Deep Clean 2BR Apartment"
                    placeholderTextColor={colors.icon}
                    value={formData.title}
                    onChangeText={(text) => updateFormData({ title: text })}
                  />
                  <TouchableOpacity
                    style={[styles.autoCompleteButton, { backgroundColor: colors.tint }]}
                    onPress={() => {
                      const autoTitle = generateJobTitle();
                      if (autoTitle) {
                        updateFormData({ title: autoTitle });
                      }
                    }}
                  >
                    <Ionicons name="sparkles" size={16} color="white" />
                    <Text style={styles.autoCompleteText}>Auto</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Special Instructions (optional)
                </Text>
                <TextInput
                  style={[styles.textAreaInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder={getInstructionsExample()}
                  placeholderTextColor={colors.icon}
                  value={formData.additionalInstructions}
                  onChangeText={(text) => updateFormData({ additionalInstructions: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Who provides cleaning supplies?
                </Text>
                <SelectionButton
                  title="Cleaner brings supplies"
                  description="Cleaner provides all cleaning products"
                  isSelected={formData.supplies === 'cleaner'}
                  onPress={() => updateFormData({ supplies: 'cleaner' })}
                />
                <SelectionButton
                  title="I'll provide supplies"
                  description="I have my own cleaning products"
                  isSelected={formData.supplies === 'customer'}
                  onPress={() => updateFormData({ supplies: 'customer' })}
                />
                <SelectionButton
                  title="We'll discuss"
                  description="Decide together what works best"
                  isSelected={formData.supplies === 'both'}
                  onPress={() => updateFormData({ supplies: 'both' })}
                />
              </View>
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              What's your budget?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Set your budget to help cleaners provide appropriate offers
            </Text>
            
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Budget Type</Text>
              <SelectionButton
                title="Fixed Price"
                description="Total amount for the entire job"
                isSelected={formData.budgetType === 'fixed'}
                onPress={() => updateFormData({ budgetType: 'fixed' })}
              />
              <SelectionButton
                title="Hourly Rate"
                description="Pay per hour of work"
                isSelected={formData.budgetType === 'hourly'}
                onPress={() => updateFormData({ budgetType: 'hourly' })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {formData.budgetType === 'fixed' ? 'Total Budget *' : 'Hourly Rate *'}
              </Text>
              <View style={styles.budgetInputContainer}>
                <Text style={[styles.dollarSign, { color: colors.text }]}>$</Text>
                <TextInput
                  style={[styles.budgetInput, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.background 
                  }]}
                  placeholder={formData.budgetType === 'fixed' ? '150' : '25'}
                  placeholderTextColor={colors.icon}
                  value={formData.budgetAmount}
                  onChangeText={(text) => updateFormData({ budgetAmount: text })}
                  keyboardType="numeric"
                />
                <Text style={[styles.budgetSuffix, { color: colors.icon }]}>
                  {formData.budgetType === 'hourly' ? '/hour' : ''}
                </Text>
              </View>
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Add Photos (Optional)
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Help cleaners understand your space better with photos. Add up to 6 images.
            </Text>
            
            <View style={styles.photoUploadSection}>
              {/* Upload Buttons */}
              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: colors.tint }]}
                  onPress={showPhotoOptions}
                >
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>Add Photos</Text>
                </TouchableOpacity>
                
                {formData.photos.length > 0 && (
                  <TouchableOpacity
                    style={[styles.clearPhotosButton, { borderColor: colors.tint }]}
                    onPress={() => updateFormData({ photos: [] })}
                  >
                    <Ionicons name="trash" size={20} color={colors.tint} />
                    <Text style={[styles.clearPhotosText, { color: colors.tint }]}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Photo Grid */}
              {formData.photos.length > 0 && (
                <View style={styles.photoGrid}>
                  {formData.photos.map((photo, index) => {
                    return (
                      <View key={index} style={styles.photoItem}>
                        <Image
                          style={styles.photoImage}
                          source={{ uri: photo }}
                          contentFit="cover"
                          onError={(error) => console.log('Image load error:', error)}
                          onLoad={() => console.log('Image loaded successfully:', photo)}
                        />
                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => {
                            const newPhotos = formData.photos.filter((_, i) => i !== index);
                            updateFormData({ photos: newPhotos });
                          }}
                        >
                          <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  
                  {/* Add More Button */}
                  {formData.photos.length < 6 && (
                    <TouchableOpacity
                      style={[styles.addMorePhotoButton, { borderColor: colors.tint }]}
                      onPress={showPhotoOptions}
                    >
                      <Ionicons name="add" size={32} color={colors.tint} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Empty State */}
              {formData.photos.length === 0 && (
                <View style={styles.photoEmptyState}>
                  <Ionicons name="images" size={64} color={colors.icon} />
                  <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                    No photos added yet
                  </Text>
                  <Text style={[styles.emptyStateSubtitle, { color: colors.icon }]}>
                    Photos help cleaners understand your space and provide better quotes
                  </Text>
                </View>
              )}

              {/* Photo Tips */}
              <View style={[styles.photoTips, { backgroundColor: colors.tint + '10' }]}>
                <Ionicons name="bulb" size={20} color={colors.tint} />
                <View style={styles.tipsContent}>
                  <Text style={[styles.tipsTitle, { color: colors.text }]}>Photo Tips</Text>
                  <Text style={[styles.tipsText, { color: colors.icon }]}>
                    • Show areas that need special attention{'\n'}
                    • Include overall room views{'\n'}
                    • Good lighting helps cleaners see details{'\n'}
                    • Before photos help set expectations
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 9:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Review your job posting
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.icon }]}>
              Double-check everything looks good before posting
            </Text>
            
            <View style={styles.reviewContainer}>
              <View style={styles.reviewSection}>
                <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Service</Text>
                <Text style={[styles.reviewText, { color: colors.icon }]}>
                  {serviceTypes.find(s => s.id === formData.serviceType)?.name}
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Property</Text>
                <Text style={[styles.reviewText, { color: colors.icon }]}>
                  {propertyTypes.find(p => p.id === formData.propertyType)?.name} • {formData.bedrooms} BR • {formData.bathrooms} Bath
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Location</Text>
                <Text style={[styles.reviewText, { color: colors.icon }]}>
                  {formData.address}{formData.apartment ? `, ${formData.apartment}` : ''}{'\n'}
                  {formData.city}, {formData.state} {formData.zipCode}
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Schedule</Text>
                <Text style={[styles.reviewText, { color: colors.icon }]}>
                  {formData.preferredDate} at {formData.preferredTime}{'\n'}
                  {formData.recurrence === 'once' ? 'One-time' : `${formData.recurrence} recurring`} • {formData.urgency}
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Budget</Text>
                <Text style={[styles.reviewText, { color: colors.icon }]}>
                  ${formData.budgetAmount} {formData.budgetType === 'hourly' ? 'per hour' : 'total'}
                </Text>
              </View>

              {formData.additionalInstructions && (
                <View style={styles.reviewSection}>
                  <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Instructions</Text>
                  <Text style={[styles.reviewText, { color: colors.icon }]}>
                    {formData.additionalInstructions}
                  </Text>
                </View>
              )}

              {formData.photos.length > 0 && (
                <View style={styles.reviewSection}>
                  <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Photos</Text>
                  <View style={styles.reviewPhotosGrid}>
                    {formData.photos.slice(0, 4).map((photo, index) => (
                      <Image
                        key={index}
                        style={styles.reviewPhoto}
                        source={{ uri: photo }}
                        contentFit="cover"
                      />
                    ))}
                    {formData.photos.length > 4 && (
                      <View style={[styles.reviewPhoto, styles.morePhotosOverlay]}>
                        <Text style={styles.morePhotosText}>+{formData.photos.length - 4}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.serviceType !== '';
      case 2:
        return formData.propertyType !== '';
      case 3:
        return formData.address !== '' && formData.city !== '' && formData.state !== '' && formData.zipCode !== '';
      case 4:
        return true; // Always valid, has defaults
      case 5:
        return formData.preferredDate !== '' && formData.preferredTime !== '';
      case 6:
        return formData.title !== '';
      case 7:
        return formData.budgetAmount !== '';
      case 8:
        return true; // Photos are optional
      case 9:
        return true; // Review step
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => currentStep > 1 ? prevStep() : router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Post a Job
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <StepIndicator />

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton, { borderColor: colors.tint }]}
              onPress={prevStep}
            >
              <Text style={[styles.prevButtonText, { color: colors.tint }]}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              { 
                backgroundColor: isStepValid() ? colors.tint : colors.icon + '40',
                flex: currentStep === 1 ? 1 : 0.6
              }
            ]}
            onPress={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={!isStepValid()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? 'Post Job' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  headerRight: {
    width: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionContent: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectionDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  propertyTypeGrid: {
    gap: 12,
  },
  numberSelectorsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  numberSelector: {
    flex: 1,
  },
  numberLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  numberControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  numberValue: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textAreaInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetSuffix: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  reviewContainer: {
    gap: 20,
  },
  reviewSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
  },
  prevButton: {
    borderWidth: 2,
  },
  nextButton: {
    // backgroundColor set dynamically
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  titleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  autoCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  autoCompleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  photoUploadSection: {
    gap: 20,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadButton: {
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearPhotosButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  clearPhotosText: {
    fontSize: 16,
    fontWeight: '600',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  photoItem: {
    position: 'relative',
    width: (width - 60) / 3, // Account for padding and gaps  
    aspectRatio: 1,
    marginBottom: 12,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#f0f0f0', // Fallback background
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMorePhotoButton: {
    width: (width - 60) / 3, // Account for padding and gaps
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoEmptyState: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  photoTips: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontWeight: '400',
  },
  reviewPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reviewPhoto: {
    width: '33.33%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  morePhotosOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  morePhotosText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 