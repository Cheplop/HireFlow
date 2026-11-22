import { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../components/common/PrimaryButton';
import { JobFormField } from '../../../components/employer/JobFormField';
import { JobFormSection } from '../../../components/employer/JobFormSection';
import { ChipGroup } from '../../../components/employer/ChipGroup';
import { useAuth } from '../../../contexts/AuthContext';
import { useApplications } from '../../../contexts/ApplicationsContext';
import { useJobs } from '../../../contexts/JobsContext';
import theme from '../../../styles/theme';

const employmentTypes = ['Full-time', 'Part-time', 'Contractual'];
const workModes = ['On-site', 'Remote', 'Hybrid'];
const employmentIcons = {
    'Full-time': 'time',
    'Part-time': 'time-outline',
    Contractual: 'document-text-outline',
};
const workModeIcons = {
    'On-site': 'business-outline',
    Remote: 'home-outline',
    Hybrid: 'swap-horizontal',
};
const DESCRIPTION_LIMIT = 1000;
const REQUIRED_FIELDS = 4;

export default function Posts() {
    const { user } = useAuth();
    const { createJob, updateJob, deleteJob, getJobsForEmployer, toggleJobAvailability } = useJobs();
    const { deleteApplicationsForJob } = useApplications();
    const employerJobs = getJobsForEmployer(user.id);

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [employmentType, setEmploymentType] = useState(employmentTypes[0]);
    const [workMode, setWorkMode] = useState(workModes[0]);
    const [editingJob, setEditingJob] = useState(null);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const requiredDone = [title, company, description, salary].filter((v) => v.trim()).length;
    const responsibilityCount = responsibilities.split('\n').filter((line) => line.trim()).length;

    function clearFieldError(name) {
        if (fieldErrors[name]) {
            setFieldErrors((current) => ({ ...current, [name]: undefined }));
        }
    }

    function saveJob() {
        const numericSalary = Number(salary);
        const responsibilityList = responsibilities
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);

        const nextErrors = {};
        if (!title.trim()) nextErrors.title = 'Add a job title.';
        if (!company.trim()) nextErrors.company = 'Add your company name.';
        if (!description.trim()) nextErrors.description = 'Describe the job.';
        if (!salary.trim() || !Number.isFinite(numericSalary) || numericSalary < 0) {
            nextErrors.salary = 'Enter a valid salary.';
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            setError('Please fix the highlighted fields.');
            return;
        }

        setFieldErrors({});
        setError('');
        const jobData = {
            jobTitle: title.trim(),
            jobCompany: company.trim(),
            jobLocation: location.trim(),
            jobDescription: description.trim(),
            responsibilities: responsibilityList,
            salary: numericSalary,
            jobMode: employmentType,
            jobType: workMode,
            companyLogo: editingJob?.companyLogo || require('../../../assets/images/Hireflow.png'),
        };

        try {
            if (editingJob) {
                updateJob(editingJob.id, user.id, jobData);
            } else {
                createJob(user.id, jobData);
            }
            cancelEditing();
        } catch (saveError) {
            setError(saveError.message);
        }
    }

    function startEditing(job) {
        setEditingJob(job);
        setTitle(job.jobTitle);
        setCompany(job.jobCompany);
        setLocation(job.jobLocation || '');
        setDescription(job.jobDescription || '');
        setResponsibilities((job.responsibilities || []).join('\n'));
        setSalary(String(job.salary ?? ''));
        setEmploymentType(job.jobMode || employmentTypes[0]);
        setWorkMode(job.jobType || workModes[0]);
        setError('');
        setFieldErrors({});
    }

    function cancelEditing() {
        setEditingJob(null);
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        setResponsibilities('');
        setSalary('');
        setEmploymentType(employmentTypes[0]);
        setWorkMode(workModes[0]);
        setError('');
        setFieldErrors({});
    }

    function handleDelete(job) {
        try {
            deleteApplicationsForJob(job.id, user.id);
            deleteJob(job.id, user.id);
            if (editingJob?.id === job.id) cancelEditing();
            setError('');
        } catch (deleteError) {
            setError(deleteError.message);
        }
    }

    function handleToggleAvailability(job) {
        try {
            toggleJobAvailability(job.id, user.id);
        } catch (toggleError) {
            setError(toggleError.message);
        }
    }

    function renderJob({ item }) {
        return (
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    <Image source={item.companyLogo} style={styles.postImage} />

                    <View style={styles.postInfo}>
                        <Text style={styles.postTitle}>{item.jobTitle}</Text>
                        <Text style={styles.mutedText}>{item.jobCompany}</Text>
                        <Text style={styles.postPrice}>
                            ₱{Number(item.salary || 0).toLocaleString()}
                        </Text>
                        <Text
                            style={[
                                styles.statusBadge,
                                item.isPublished ? styles.statusOpen : styles.statusClosed,
                            ]}
                        >
                            {item.isPublished ? 'Open' : 'Closed'}
                        </Text>
                    </View>
                </View>

                <View style={styles.postActions}>
                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="Edit"
                            variant="secondary"
                            onPress={() => startEditing(item)}
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title={item.isPublished ? 'Close' : 'Reopen'}
                            variant="secondary"
                            onPress={() => handleToggleAvailability(item)}
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="Delete"
                            variant="secondary"
                            onPress={() => handleDelete(item)}
                        />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={employerJobs}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderJob}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View>
                        <Text style={styles.screenTitle}>My Jobs</Text>
                        <Text style={styles.screenSubtitle}>
                            Publish and manage your job listings.
                        </Text>

                        <View style={styles.formCard}>
                            <View style={styles.formHeader}>
                                <View style={styles.formIcon}>
                                    <Ionicons
                                        name={editingJob ? 'create-outline' : 'briefcase-outline'}
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </View>
                                <View style={styles.formHeaderText}>
                                    <Text style={styles.formTitle}>
                                        {editingJob ? 'Edit job' : 'Post a new job'}
                                    </Text>
                                    <Text style={styles.formSubtitle}>
                                        {editingJob
                                            ? 'Update the details for this listing.'
                                            : 'Fill in the details candidates will see.'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.progressWrap}>
                                <View style={styles.progressTrack}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${(requiredDone / REQUIRED_FIELDS) * 100}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>
                                    {requiredDone}/{REQUIRED_FIELDS} required
                                </Text>
                            </View>

                            <JobFormSection step={1} title="The basics">
                                <JobFormField
                                    label="Job title"
                                    required
                                    icon="briefcase-outline"
                                    value={title}
                                    onChangeText={(text) => {
                                        setTitle(text);
                                        clearFieldError('title');
                                    }}
                                    placeholder="e.g. Frontend Developer"
                                    error={fieldErrors.title}
                                />
                                <JobFormField
                                    label="Company"
                                    required
                                    icon="business-outline"
                                    value={company}
                                    onChangeText={(text) => {
                                        setCompany(text);
                                        clearFieldError('company');
                                    }}
                                    placeholder="e.g. Acme Corp"
                                    error={fieldErrors.company}
                                />
                                <JobFormField
                                    label="Location"
                                    icon="location-outline"
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="City, country or remote"
                                    hint="Optional"
                                />
                            </JobFormSection>

                            <View style={styles.divider} />

                            <JobFormSection step={2} title="About the role">
                                <JobFormField
                                    label="Description"
                                    required
                                    multiline
                                    value={description}
                                    onChangeText={(text) => {
                                        setDescription(text);
                                        clearFieldError('description');
                                    }}
                                    placeholder="What will this person do, and what makes the role great?"
                                    maxLength={DESCRIPTION_LIMIT}
                                    counter={`${description.length}/${DESCRIPTION_LIMIT}`}
                                    error={fieldErrors.description}
                                />
                                <JobFormField
                                    label="Responsibilities"
                                    multiline
                                    value={responsibilities}
                                    onChangeText={setResponsibilities}
                                    placeholder={'Build and maintain features\nReview teammates\' code'}
                                    counter={responsibilityCount ? `${responsibilityCount} added` : undefined}
                                    hint="Put each responsibility on its own line."
                                />
                            </JobFormSection>

                            <View style={styles.divider} />

                            <JobFormSection step={3} title="Pay & terms">
                                <JobFormField
                                    label="Salary"
                                    required
                                    prefix="₱"
                                    value={salary}
                                    onChangeText={(text) => {
                                        setSalary(text);
                                        clearFieldError('salary');
                                    }}
                                    placeholder="0"
                                    keyboardType="decimal-pad"
                                    error={fieldErrors.salary}
                                />
                                <ChipGroup
                                    label="Employment type"
                                    options={employmentTypes}
                                    value={employmentType}
                                    onChange={setEmploymentType}
                                    icons={employmentIcons}
                                />
                                <ChipGroup
                                    label="Work mode"
                                    options={workModes}
                                    value={workMode}
                                    onChange={setWorkMode}
                                    icons={workModeIcons}
                                />
                            </JobFormSection>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Ionicons
                                        name="alert-circle"
                                        size={16}
                                        color={theme.actions.deletePrimary}
                                    />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <Pressable
                                onPress={saveJob}
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                    styles.publishButton,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Ionicons
                                    name={editingJob ? 'checkmark-circle' : 'paper-plane'}
                                    size={18}
                                    color={theme.fontColor.dark}
                                />
                                <Text style={styles.publishText}>
                                    {editingJob ? 'Save changes' : 'Publish job'}
                                </Text>
                            </Pressable>

                            {editingJob ? (
                                <Pressable onPress={cancelEditing} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>Cancel editing</Text>
                                </Pressable>
                            ) : null}
                        </View>

                        <View style={styles.listHeading}>
                            <Text style={styles.sectionTitle}>Your published jobs</Text>
                            <Text style={styles.productCount}>{employerJobs.length} jobs</Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No jobs yet. Publish your first listing above.
                    </Text>
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    listContent: {
        padding: theme.spacing.medium + 4,
        paddingBottom: 130, // clears the floating tab bar
    },

    screenTitle: {
        fontSize: 26,
        fontWeight: theme.fontWeight.bold,
        color: theme.fontColor.primary,
    },

    screenSubtitle: {
        fontSize: 14,
        color: theme.fontColor.secondary,
        marginTop: 5,
        marginBottom: theme.spacing.large - 2,
    },

    /* ---------- Form ---------- */
    formCard: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.medium + 2,
        borderRadius: theme.radius.medium,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: theme.spacing.large - 4,
    },

    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.medium - 4,
    },

    formIcon: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.small,
        backgroundColor: theme.colors.mutedBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },

    formHeaderText: {
        flex: 1,
    },

    formTitle: {
        fontSize: theme.fontSize.large + 1,
        fontWeight: theme.fontWeight.bold,
        color: theme.fontColor.primary,
    },

    formSubtitle: {
        fontSize: theme.fontSize.small + 1,
        color: theme.fontColor.secondary,
        marginTop: 2,
    },

    progressWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.small + 2,
    },

    progressTrack: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.mutedBackground,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
    },

    progressText: {
        fontSize: theme.fontSize.xsmall,
        fontWeight: theme.fontWeight.semibold,
        color: theme.fontColor.secondary,
    },

    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
    },

    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.small,
        backgroundColor: theme.actions.deleteBg,
        borderRadius: theme.radius.small,
        padding: theme.spacing.medium - 4,
        borderWidth: 1,
        borderColor: theme.actions.deletePrimary,
    },

    errorText: {
        flex: 1,
        color: theme.actions.deletePrimary,
        fontSize: theme.fontSize.small + 1,
    },

    publishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.small,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.small,
        paddingVertical: theme.spacing.medium - 1,
    },

    publishText: {
        color: theme.fontColor.dark,
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.bold,
    },

    cancelButton: {
        alignItems: 'center',
        paddingVertical: 4,
        marginTop: -theme.spacing.small,
    },

    cancelText: {
        color: theme.fontColor.secondary,
        fontSize: theme.fontSize.small + 1,
        fontWeight: theme.fontWeight.semibold,
    },

    pressed: {
        opacity: 0.9,
    },

    /* ---------- Published jobs list ---------- */
    listHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.large + 4,
        marginBottom: theme.spacing.medium - 2,
    },

    sectionTitle: {
        fontSize: theme.fontSize.large + 1,
        fontWeight: theme.fontWeight.bold,
        color: theme.fontColor.primary,
    },

    productCount: {
        fontSize: theme.fontSize.small,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    postCard: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.medium - 2,
        borderRadius: theme.radius.medium,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: theme.spacing.medium - 2,
    },

    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.medium - 2,
    },

    postImage: {
        width: 85,
        height: 85,
        borderRadius: theme.radius.small,
        backgroundColor: theme.colors.mutedBackground,
        resizeMode: 'contain',
    },

    mutedText: {
        fontSize: theme.fontSize.xsmall,
        color: theme.fontColor.secondary,
    },

    postInfo: {
        flex: 1,
        gap: 5,
    },

    postTitle: {
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.semibold,
        color: theme.fontColor.primary,
    },

    postPrice: {
        fontSize: theme.fontSize.large - 2,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },

    postActions: {
        flexDirection: 'row',
        gap: theme.spacing.small,
    },

    actionButton: {
        flex: 1,
    },

    separator: {
        height: theme.spacing.medium - 4,
    },

    emptyText: {
        textAlign: 'center',
        color: theme.fontColor.secondary,
        paddingVertical: theme.spacing.large,
    },

    statusBadge: {
        alignSelf: 'flex-start',
        fontSize: theme.fontSize.xsmall,
        fontWeight: theme.fontWeight.bold,
        paddingHorizontal: theme.spacing.small,
        paddingVertical: 2,
        borderRadius: theme.radius.small,
        overflow: 'hidden',
    },

    statusOpen: {
        backgroundColor: '#E3F5EA',
        color: '#1E7B3A',
    },

    statusClosed: {
        backgroundColor: theme.actions.deleteBg,
        color: theme.actions.deletePrimary,
    },
});