import { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme';
import StatusCard from '../common/StatusCard';
import { AuthInput } from '../common/AuthInput';
import { PrimaryButton } from '../common/PrimaryButton';

export default function ApplicationsCard({
  application,
  job,
  onUpdate,
  onWithdraw,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [coverLetter, setCoverLetter] = useState(application.coverLetter || '');
  const [error, setError] = useState('');
  const canEdit = application.status === 'Pending';

function saveChanges() {
  const trimmedCoverLetter = coverLetter.trim();

  if (trimmedCoverLetter.length < 50) {
    setError('Cover letter must be at least 50 characters.');
    return;
  }

  try {
    onUpdate(application.id, trimmedCoverLetter);
    setCoverLetter(trimmedCoverLetter);
    setIsEditing(false);
    setError('');
  } catch (updateError) {
    setError(updateError.message);
  }
}

  function withdraw() {
    try {
      onWithdraw(application.id);
    } catch (withdrawError) {
      setError(withdrawError.message);
    }
  }

  return (
    <View style={styles.card}>
      {/* Tapping the header toggles the expanded state */}
      <TouchableOpacity 
        style={styles.header} 
        activeOpacity={0.7} 
        onPress={() => {
          setIsExpanded(!isExpanded);
          if (isEditing) {
            setIsEditing(false); // Reset editing mode when collapsing
          }
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={job.companyLogo} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.statusLabel}>
            Application status:{' '}
            <Text style={styles.statusLabelText}>{application.status}</Text>
          </Text>
          <Text style={styles.cardTitle} numberOfLines={1}>{job.jobTitle}</Text>
          <Text style={styles.cardCompany} numberOfLines={1}>{job.jobCompany}</Text>
        </View>
        <View style={styles.statusContainer}>
          <StatusCard status={application.status} />
        </View>
      </TouchableOpacity>

      {/* Expanded Content: Cover Letter & Actions */}
      {isExpanded && (
        <View style={styles.expandedSection}>
          {isEditing ? (
            <AuthInput
              label="Cover letter"
              value={coverLetter}
              onChangeText={setCoverLetter}
              placeholder="Add a short note to the employer"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.coverLetterInput}
            />
          ) : coverLetter ? (
            <View style={styles.coverLetterContainer}>
              <Text style={styles.coverLetterLabel}>Cover letter:</Text>
              <Text style={styles.coverLetterText} numberOfLines={3}>{coverLetter}</Text>
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {canEdit && (
            <View style={styles.actions}>
              {isEditing ? (
                <>
                  <PrimaryButton title="Save" onPress={saveChanges} style={styles.actionButton} />
                  <PrimaryButton
                    title="Cancel"
                    variant="secondary"
                    onPress={() => {
                      setCoverLetter(application.coverLetter || '');
                      setIsEditing(false);
                      setError('');
                    }}
                    style={styles.actionButton}
                  />
                </>
              ) : (
                <>
                  <PrimaryButton
                    title="Edit"
                    variant="secondary"
                    onPress={() => setIsEditing(true)}
                    style={styles.actionButton}
                  />
                  <PrimaryButton
                    title="Withdraw"
                    variant="secondary"
                    onPress={withdraw}
                    style={styles.actionButton}
                  />
                </>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    flexDirection: 'column',
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: theme.boxShadow?.default,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.medium,
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 52,
    height: 52,
    borderRadius: theme.radius.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  image: {
    width: 32,
    height: 32,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLabel: {
    color: theme.fontColor.secondary,
    fontSize: 11,
    marginBottom: 4,
  },
  statusLabelText: {
    color: theme.fontColor.primary,
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
    color: theme.fontColor.primary,
  },
  cardCompany: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    marginTop: 3,
  },
  statusContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  expandedSection: {
    flexDirection: 'column',
    gap: theme.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    paddingTop: theme.spacing.medium,
  },
  coverLetterContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing.small,
    borderRadius: theme.radius.small,
    gap: 2,
  },
  coverLetterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.fontColor.primary,
  },
  coverLetterText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  coverLetterInput: {
    marginBottom: 0,
  },
  errorText: {
    color: '#B3261E',
    fontSize: theme.fontSize.small,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  actionButton: {
    flex: 1,
  },
});