import { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../styles/theme';
import StatusCard from './StatusCard';
import { AuthInput } from './AuthInput';
import { PrimaryButton } from './PrimaryButton';

export default function ApplicationsCard({
  application,
  job,
  onUpdate,
  onWithdraw,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [coverLetter, setCoverLetter] = useState(application.coverLetter || '');
  const [error, setError] = useState('');
  const canEdit = application.status === 'Pending';

  function saveChanges() {
    try {
      onUpdate(application.id, coverLetter);
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
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image source={job.companyLogo} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Application status: </Text>
            <Text style={styles.statusLabelText}>{application.status}</Text>
            <StatusCard status={application.status} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{job.jobTitle}</Text>
          <Text style={styles.cardCompany}>{job.jobCompany}</Text>
        </View>
      </View>

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
        <Text style={styles.coverLetter}>Cover letter: {coverLetter}</Text>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {canEdit ? (
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 100,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    flexDirection: 'column',
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 56,
    height: 56,
    borderRadius: theme.radius.small,
    boxShadow: theme.boxShadow.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 38,
    height: 38,
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
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLabel: {
    color: theme.fontColor.secondary,
    fontSize: 11,
    marginBottom: 5,
  },
  statusLabelText: {
    color: theme.fontColor.primary,
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coverLetterInput: {
    marginBottom: 0,
  },
  coverLetter: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
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